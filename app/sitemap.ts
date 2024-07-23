import { siteConfig } from '@/config/site';
import { getPosts, getProps } from '@/lib/postQueries';

export default async function sitemap() {
  let siteMap = [];

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
    lastModified: new Date(getProps('content/pages', 'about').meta.date).toISOString().split('T')[0],
  });

  const posts = getPosts({ });

  posts.forEach((post) => {
    siteMap.push({
      url: `${siteConfig.url}/posts/${post.slug}`,
      lastModified: siteConfig.lastModifiedIsTrue ? siteConfig.lastModifiedDate : new Date(String(post.meta.lastModified ?? post.meta.date)).toISOString().split('T')[0],
    });
  });

  siteMap.push({
    url: `${siteConfig.url}/posts/page/1`,
    lastModified: siteConfig.date,
  });

  return siteMap;
}