import getPosts, { getPostsLength } from '@/app/lib/getPosts';
import { getListOfAllTags } from '@/app/lib/getListOfAllTags';
import { siteConfig } from '@/config/site';
import getProps from '@/app/lib/getProps';

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

  const tags = getListOfAllTags();
  tags.forEach((tag) => {
    const postsWithTagLength = getPostsLength(tag);
    for (let i = 1; i <= Math.ceil(postsWithTagLength / siteConfig.postNumPerPage); i++) {
      siteMap.push({
        url: `${siteConfig.url}/tags/${tag}/page/${i}`,
        lastModified: siteConfig.date,
      });
    }
  });

  const posts = getPosts({ });

  posts.forEach((post) => {
    siteMap.push({
      url: `${siteConfig.url}/posts/${post.slug}`,
      lastModified: new Date(String(post.meta.lastModified ?? post.meta.date)).toISOString().split('T')[0],
    });
  });

  for (let i = 1; i <= Math.ceil(posts.length / siteConfig.postNumPerPage); i++) {
    siteMap.push({
      url: `${siteConfig.url}/posts/page/${i}`,
      lastModified: siteConfig.date,
    });
  }

  return siteMap;
}