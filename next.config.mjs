import withPlaiceholder from "@plaiceholder/next";

import "./src/env.ts";

const isProduction = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  turbopack: {},
  cacheComponents: true,
  images: {
    qualities: [75],
    ...(isProduction
      ? {
          loader: "custom",
          loaderFile: "./next-images-loader.js",
        }
      : {}),
  },
};

export default withPlaiceholder(nextConfig);
