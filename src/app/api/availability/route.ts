import { parseISO } from "date-fns";
import { errAsync, fromThrowable, ResultAsync } from "neverthrow";
import { NextResponse } from "next/server";
import {
  AVAILABILITY_TIME_ZONE,
  type Availability,
  type BusyPeriod,
  UKTime,
} from "@/config/types";
import { env } from "@/env";

const unavailable = "Availability unavailable.";

// Fastmail's free/busy feeds already expand recurring events into UTC periods.
const parseCalendar = fromThrowable(
  (source: string): BusyPeriod[] => {
    if (!source.includes("END:VCALENDAR") || source.includes("RRULE:")) {
      throw new Error(unavailable);
    }

    return [
      ...source.matchAll(/BEGIN:VEVENT\r?\n([\s\S]*?)END:VEVENT/g),
    ].flatMap(([, event]) => {
      if (/^(TRANSP:TRANSPARENT|STATUS:CANCELLED)\r?$/m.test(event)) return [];
      const start = parseISO(
        event.match(/^DTSTART:(\d{8}T\d{6}Z)\r?$/m)?.[1] ?? "",
      ).getTime();
      const end = parseISO(
        event.match(/^DTEND:(\d{8}T\d{6}Z)\r?$/m)?.[1] ?? "",
      ).getTime();
      if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
        throw new Error(unavailable);
      }
      return [{ start, end }];
    });
  },
  () => unavailable,
);

const getCalendar = (url: string) =>
  ResultAsync.fromPromise(
    fetch(url, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(10_000),
    }),
    () => unavailable,
  )
    .andThen((response) =>
      response.ok
        ? ResultAsync.fromPromise(response.text(), () => unavailable)
        : errAsync(unavailable),
    )
    .andThen(parseCalendar);

// UK midnight is either 00:00 UTC (GMT) or 23:00 the night before (BST).
const UKMidnight = (utcMidnight: number) =>
  utcMidnight - Number(UKTime.format(utcMidnight).slice(0, 2)) * 3_600_000;

export async function GET() {
  const result = await ResultAsync.combine(env.CALENDAR_URLS.map(getCalendar));
  if (result.isErr()) {
    return NextResponse.json({ error: unavailable }, { status: 503 });
  }

  const [day, month, year] = new Intl.DateTimeFormat("en-GB", {
    timeZone: AVAILABILITY_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(new Date())
    .split("/")
    .map(Number);
  const midnight = Date.UTC(year, month - 1, day);
  const dayStart = UKMidnight(midnight);
  const dayEnd = UKMidnight(midnight + 86_400_000);
  const periods = result.value
    .flat()
    .map(({ start, end }) => ({
      start: Math.max(start, dayStart),
      end: Math.min(end, dayEnd),
    }))
    .filter(({ start, end }) => start < end)
    .sort((a, b) => a.start - b.start);

  const busy: BusyPeriod[] = [];
  for (const period of periods) {
    const previous = busy.at(-1);
    if (previous && period.start <= previous.end) {
      previous.end = Math.max(previous.end, period.end);
    } else {
      busy.push(period);
    }
  }

  return NextResponse.json({ dayStart, dayEnd, busy } satisfies Availability, {
    headers: { "Cache-Control": "no-store" },
  });
}
