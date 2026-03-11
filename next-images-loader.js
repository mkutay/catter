"use client";

export default function myImageLoader({ src, width, quality }) {
  const isLocal = !src.startsWith("http");
  const parsedWidth = Number.parseInt(String(width), 10);
  const safeWidth = Number.isFinite(parsedWidth) ? parsedWidth : 0;
  const parsedQuality = Number.parseInt(String(quality), 10);
  const safeQuality = Number.isFinite(parsedQuality) ? parsedQuality : 75;

  const imageOptimizationApi = "https://images.mkutay.dev";
  // Your NextJS application URL
  const baseUrl = "https://www.mkutay.dev";

  const query = `width=${safeWidth}&quality=${safeQuality}`;

  if (
    isLocal &&
    (process.env.NODE_ENV === "development" ||
      process.env.SITE_URL === "http://localhost:3000")
  ) {
    const hasQuery = src.includes("?");
    return `${src}${hasQuery ? "&" : "?"}${query}`;
  }
  if (isLocal) {
    const hasQuery = src.includes("?");
    return `${baseUrl}${src}${hasQuery ? "&" : "?"}${query}`;
  }
  return `${imageOptimizationApi}/image/${src}?${query}`;
}
