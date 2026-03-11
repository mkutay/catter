import withPlaiceholder from "@plaiceholder/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  turbopack: {},
  images: {
    loader: "custom",
    loaderFile: "./next-images-loader.js",
  },
};
export default withPlaiceholder(nextConfig);
