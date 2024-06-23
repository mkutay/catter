import { MetadataRoute } from 'next';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      crawlDelay: 86400,
    },
    sitemap: 'https://www.mkutay.dev/sitemap.xml',
  }
}