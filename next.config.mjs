/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions`` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
  // experimental: {
  //   outputFileTracingIncludes: {
  //     '../': ['./content/pages/*', './content/posts/*'],
  //   }
  // }
};

export default nextConfig;