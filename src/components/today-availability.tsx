"use client";

import { ResultAsync } from "neverthrow";
import { useEffect, useState } from "react";
import { type Availability, UKTime } from "@/config/types";

export function TodayAvailability() {
  const [data, setData] = useState<Availability | null>(null);
  const [now, setNow] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const refresh = () => {
      setNow(Date.now());
      ResultAsync.fromPromise(
        fetch("/api/availability", {
          cache: "no-store",
          signal: AbortSignal.any([
            controller.signal,
            AbortSignal.timeout(10_000),
          ]),
        }).then((response) =>
          response.ok
            ? (response.json() as Promise<Availability>)
            : Promise.reject(new Error("Availability unavailable")),
        ),
        () => "Availability unavailable",
      ).match(
        (availability) => {
          if (controller.signal.aborted) return;
          setData(availability);
          setFailed(false);
        },
        () => {
          if (controller.signal.aborted) return;
          setData(null);
          setFailed(true);
        },
      );
    };

    refresh();
    const timer = setInterval(refresh, 60_000);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, []);

  if (!data || now < data.dayStart || now >= data.dayEnd) {
    if (failed) console.log("Availability unavailable.");
    else console.log("Loading today's availability…");
    return;
  }

  const duration = data.dayEnd - data.dayStart;
  const position = (time: number) =>
    `${((time - data.dayStart) / duration) * 100}%`;
  const hours = Array.from(
    { length: duration / 3_600_000 },
    (_, hour) => data.dayStart + hour * 3_600_000,
  );

  return (
    <section
      aria-label="Today's availability"
      className="md:max-w-6xl max-w-prose mx-auto px-4 pb-16 md:pb-24"
      id="free"
    >
      <div className="space-y-2 font-mono">
        <p className="text-sm">Today / UK time / Purple = Busy / Rest = Free</p>
        <div className="overflow-x-auto">
          <div className="relative h-28 min-w-240 text-xs tabular-nums">
            <div className="absolute inset-x-0 inset-y-6 bg-muted" />
            {data.busy.map(({ start, end }) => (
              <div
                key={start}
                className="absolute inset-y-6 bg-mauve"
                style={{
                  left: position(start),
                  width: `${((end - start) / duration) * 100}%`,
                }}
                title={`Busy ${UKTime.format(start)}–${end === data.dayEnd ? "24:00" : UKTime.format(end)}`}
              />
            ))}
            {hours.map((hour) => (
              <div
                key={hour}
                className={`absolute inset-y-6 border-l border-dashed ${
                  data.busy.some(
                    ({ start, end }) => hour >= start && hour < end,
                  )
                    ? "border-primary-foreground/60"
                    : "border-muted-foreground/40"
                }`}
                style={{ left: position(hour) }}
              >
                <span className="absolute -top-4.5">{UKTime.format(hour)}</span>
              </div>
            ))}
            <div
              className={`absolute inset-y-6 border-l-2 ${
                data.busy.some(({ start, end }) => now >= start && now < end)
                  ? "border-primary-foreground"
                  : "border-foreground"
              }`}
              style={{ left: position(now) }}
            >
              <span className="absolute top-full left-1 whitespace-nowrap">
                {UKTime.format(now)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
