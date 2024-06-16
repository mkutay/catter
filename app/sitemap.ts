import { MetadataRoute } from 'next';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { parseISO, format } from 'date-fns';

export default function sitemap(): MetadataRoute.Sitemap {
  const postFiles = fs.readdirSync(path.join(process.cwd(), 'app/posts/posts/'), 'utf-8');

  const posts = postFiles.map(filename => {
    const slug = filename.replace('.mdx', '');
    const source = fs.readFileSync(path.join(process.cwd(), `app/posts/posts/${slug}.mdx`), 'utf-8');
    let { data: frontMatter } = matter(source);

    const formattedDate = format(frontMatter.date, 'PP');

    frontMatter.date = formattedDate;

    return {
      meta: frontMatter,
      slug: slug,
    };
  });

  const postsLength = posts.length;

  let siteMap = [];

  posts.forEach((post) => {
    siteMap.push({
      url: `https://www.mkutay.dev/posts/${post.slug}`,
      lastModified: new Date(String(post.meta.date)),
      changeFrequency: 'monthly',
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
    changeFrequency: "daily" as const,
    priority: 0.75,
  });

  siteMap.push({
    url: 'https://www.mkutay.dev/about',
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
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