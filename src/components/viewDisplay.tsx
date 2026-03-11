"use client";

import { useEffect, useState } from "react";

export function ViewDisplay({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;

    fetch(`/api/views?slug=${slug}`)
      .then((res) => res.text())
      .then((text) => {
        if (ignore) return;
        const count = parseInt(text, 10);
        if (!Number.isNaN(count)) {
          setViews(count);
        } else {
          console.error("Failed to parse view count:", text);
        }
      });

    return () => {
      ignore = true;
    };
  }, [slug]);

  if (!views) return null;

  return <p>{views} views</p>;
}
