import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin('./app/lib/i18n.ts');

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

export default withNextIntl(nextConfig);