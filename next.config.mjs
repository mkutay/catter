import withPlaiceholder from "@plaiceholder/next";

import "./src/env.ts";

const isProduction = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  turbopack: {},
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
