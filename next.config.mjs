/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions`` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    loader: 'custom',
    loaderFile: './next-images-loader.js',
  },
  // Optionally, add any other Next.js config below
  // experimental: {
  //   outputFileTracingIncludes: {
  //     '../': ['./content/pages/*', './content/posts/*'],
  //   }
  // }
};

export default nextConfig;