'use client';

import { useEffect, useState } from "react";

import Server from "@/lib/server";

export function ViewDisplay({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;
    Server.Views.Get({ slug }).then((views) => {
      if (!ignore) {
        setViews(views.ok ? views.value : null);
      }
    })

    return () => {
      ignore = true;
    }
  }, [slug]);

  if (!views) return null;

  return (
    <p>
      {views} views
    </p>
  );
}