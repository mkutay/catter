"use client";

import { useEffect, useState } from "react";

/**
 * Component that displays the view count for a post with a given
 * slug, and optionally increments it when the component mounts.
 *
 * @param slug The slug of the post to display the view count for.
 * @param increment Whether to increment the view count when the
 *  component mounts.
 */
export function ViewDisplay({
  slug,
  increment = false,
}: {
  slug: string;
  increment?: boolean;
}) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;

    const searchParams = new URLSearchParams({ slug });
    if (increment) {
      searchParams.append("increment", "true");
    }

    fetch(`/api/views?${searchParams.toString()}`)
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
  }, [slug, increment]);

  if (!views) return null;

  if (views === 1) return <p>1 view</p>;
  return <p>{views} views</p>;
}
