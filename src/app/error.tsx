'use client';

import { useEffect } from 'react';

export default function Error({
  error,
}: {
  error: Error;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto max-w-prose lg:max-w-6xl px-4 py-8">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Error
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-lg">
        Oh no, something went wrong... Maybe refresh?
      </p>
      <p className="leading-7 mt-12 text-sm text-muted-foreground/80">
        {error.message}
      </p>
    </section>
  );
}