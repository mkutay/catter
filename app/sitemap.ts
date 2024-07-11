import { MetadataRoute } from 'next';

import getPosts, { getPostsLength } from '@/app/lib/getPosts';
import { getListOfAllTags } from '@/app/lib/getListOfAllTags';
import { siteConfig } from '@/config/site';
import { getGuestbookEntries } from '@/app/lib/dataBaseQueries';
import getProps from '@/app/lib/getProps';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getPosts({ });

  const guestbookEntries = await getGuestbookEntries();
  guestbookEntries.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  let siteMap = [];

  posts.forEach((post) => {
    siteMap.push({
      url: `https://www.mkutay.dev/posts/${post.slug}`,
      lastModified: new Date(String(post.meta.lastModified ?? post.meta.date)),
    });
  });

  siteMap.push({
    url: siteConfig.url,
    lastModified: siteConfig.date,
  });

  siteMap.push({
    url: `${siteConfig.url}/guestbook`,
    lastModified: new Date(guestbookEntries[0].created_at),
  });

  siteMap.push({
    url: `${siteConfig.url}/about`,
    lastModified: new Date(getProps('content/pages', 'about').meta.date),
  });

  for (let i = 1; i <= Math.ceil(posts.length / siteConfig.postNumPerPage); i++) {
    siteMap.push({
      url: `https://www.mkutay.dev/posts/page/${i}`,
      lastModified: siteConfig.date,
    });
  }

  const tags = getListOfAllTags();
  tags.forEach((tag) => {
    const postsWithTagLength = getPostsLength(tag);
    for (let i = 1; i <= Math.ceil(postsWithTagLength / siteConfig.postNumPerPage); i++) {
      siteMap.push({
        url: `https://www.mkutay.dev/tags/${tag}/page/${i}`,
        lastModified: siteConfig.date,
      });
    }
  });

  return siteMap;
}