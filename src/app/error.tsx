'use client';

import { TypographyH1 } from '@/components/typography/headings';

export default function Error({
  error,
}: {
  error: Error;
}) {
  return (
    <section className="mx-auto max-w-prose lg:max-w-6xl px-4 py-8">
      <TypographyH1>
        Error
      </TypographyH1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-lg">
        Oh no, something went wrong... Maybe refresh?
      </p>
      <p className="leading-7 mt-12 text-sm text-muted-foreground/80">
        {error.message}
      </p>
    </section>
  );
}