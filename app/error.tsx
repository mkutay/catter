'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="prose mx-auto max-w-prose lg:max-w-6xl px-4 lg:px-8 py-8 prose-h1:my-0">
      <h1>
        Error
      </h1>
      <hr/>
      <p className="text-2xl">
        Oh no, something went wrong... maybe refresh?
      </p>
    </section>
  );
}