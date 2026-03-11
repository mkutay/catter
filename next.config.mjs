import withPlaiceholder from "@plaiceholder/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  turbopack: {},
  images: {
    loader: "custom",
    loaderFile: "./next-images-loader.js",
    qualities: [75],
  },
};
export default withPlaiceholder(nextConfig);
