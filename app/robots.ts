import { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/_next/', '/_vercel/', '/css/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}