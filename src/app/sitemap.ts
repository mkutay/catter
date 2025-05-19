import { getPosts } from '@/lib/dbContentQueries';
import { siteConfig } from '@/config/site';
import { getAboutProps } from '@/lib/fsContentQueries';

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

  const posts = await getPosts({ });
  if (posts.isErr()) throw new Error(posts.error.message);

  posts.value.forEach((post) => {
    siteMap.push({
      url: `${siteConfig.url}/posts/${post.slug}`,
      lastModified: new Date(String(post.lastModified ?? post.date)).toISOString().split('T')[0],
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