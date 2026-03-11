"use client";

import { env } from "./src/env";

export default function myImageLoader({ src, width, quality, height }) {
  const isLocal = !src.startsWith("http");
  const query = new URLSearchParams();

  const imageOptimizationApi = "https://images.mkutay.dev";
  const baseUrl = "https://www.mkutay.dev";

  const fullSrc = `${baseUrl}${src}`;

  if (width) query.set("width", width);
  if (quality) query.set("quality", quality);
  if (height) query.set("height", height);

  if (isLocal && env.NODE_ENV === "development") {
    return src;
  }

  if (isLocal) {
    return `${imageOptimizationApi}/image/${fullSrc}?${query.toString()}`;
  }

  return `${imageOptimizationApi}/image/${src}?${query.toString()}`;
}
