import { MetadataRoute } from 'next';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { parseISO, format } from 'date-fns';
import getPosts from './lib/getPosts';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts(0, 100000);

  const postsLength = posts.length;

  let siteMap = [];

  posts.forEach((post) => {
    siteMap.push({
      url: `https://www.mkutay.dev/posts/${post.slug}`,
      lastModified: new Date(String(post.meta.date)),
      changeFrequency: 'yearly',
      priority: 0.75,
    });
  });

  siteMap.push({
    url: 'https://www.mkutay.dev',
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  });

  siteMap.push({
    url: 'https://www.mkutay.dev/guestbook',
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  });

  siteMap.push({
    url: 'https://www.mkutay.dev/about',
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.78,
  });

  for (let i = 1; i <= Math.ceil(postsLength / 5); i++) {
    siteMap.push({
      url: `https://www.mkutay.dev/posts/page/${i}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  }

  return siteMap;
}