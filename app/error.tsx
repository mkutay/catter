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
    <section className="prose mx-auto max-w-prose sm:px-8 px-4 py-8 prose-h1:my-0">
      <h1>
        ERROR
      </h1>
      <hr/>
      <p className="text-xl">
        Oh no, something went wrong... maybe refresh?
      </p>
    </section>
  );
}