import { MetadataRoute } from 'next'
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

  const pageFiles = fs.readdirSync(path.join(process.cwd(), 'app/pages/pages/'), 'utf-8');

  const pages = pageFiles.map(filename => {
    const slug = filename.replace('.mdx', '');
    const source = fs.readFileSync(path.join(process.cwd(), `app/pages/pages/${slug}.mdx`), 'utf-8');
    let { data: frontMatter } = matter(source);

    if (typeof frontMatter.date != "undefined") {
      const formattedDate = format(frontMatter.date, 'PP');
      frontMatter.date = formattedDate;
    }

    return {
      meta: frontMatter,
      slug: slug,
    };
  });


  let siteMap = [];
  pages.forEach((page) => {
    let lastModified = new Date();
    console.log(lastModified);
    if (typeof page.meta.date != "undefined") {
      lastModified = new Date(String(page.meta.date));
    }
    siteMap.push({
      url: `https://mkutay.dev/pages/${page.slug}`,
      lastModified: lastModified,
      changeFrequency: page.meta.changeFrequency,
      priority: page.meta.priority,
    });
  });

  posts.forEach((post) => {
    siteMap.push({
      url: `https://mkutay.dev/posts/${post.slug}`,
      lastModified: new Date(String(post.meta.date)),
      changeFrequency: 'monthly',
      priority: 0.75,
    });
  });

  siteMap.push({
    url: 'https://mkutay.dev',
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  });

  return siteMap;
}