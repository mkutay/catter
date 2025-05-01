import { siteConfig } from '@/config/site';
import { getAboutProps, getPosts } from '@/lib/contentQueries';

export default async function sitemap() {
  const siteMap: {
    url: string,
    lastModified: string,
  }[] = [];

  siteMap.push({
    url: siteConfig.url,
    lastModified: siteConfig.date,
  });

  siteMap.push({
    url: `${siteConfig.url}/guestbook`,
    lastModified: siteConfig.date,
  });

  siteMap.push({
    url: `${siteConfig.url}/about`,
    lastModified: new Date(getAboutProps().meta.date).toISOString().split('T')[0],
  });

  const posts = getPosts({ });

  posts.forEach((post) => {
    siteMap.push({
      url: `${siteConfig.url}/posts/${post.slug}`,
      lastModified: new Date(String(post.meta.lastModified ?? post.meta.date)).toISOString().split('T')[0],
    });
  });

  siteMap.push({
    url: `${siteConfig.url}/posts/page/1`,
    lastModified: siteConfig.date,
  });

  siteMap.push({
    url: `${siteConfig.url}/projects`,
    lastModified: siteConfig.date,
  });

  return siteMap;
}