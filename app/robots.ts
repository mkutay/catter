import { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/*.json$', '/*.js$', '/vercel/', '/pages/', 'https://shareme.mkutay.dev/', 'https://port.mkutay.dev/', 'https://cdn.mkutay.dev/', 'https://blog.mkutay.dev/', 'https://academia.mkutay.dev'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}