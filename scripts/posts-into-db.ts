import { exit } from 'process';
import * as path from 'path';
import { fUploadImage } from '@/lib/images';

import { sql } from '@/lib/postgres';
import { getPosts } from '@/lib/fsContentQueries';

const getImageUrlsFromMDX = (content: string): string[] => {
  const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
  const imageUrls: string[] = [];
  let match;

  while ((match = imgRegex.exec(content)) !== null) {
    const imageUrl = match[2];
    imageUrls.push(imageUrl);
  }

  return imageUrls;
};

try {
  const posts = getPosts({ });

  const images: { url: string, path: string }[] = [];
  posts.forEach((post) => {
    getImageUrlsFromMDX(post.content).forEach((url) => {
      images.push({
        url,
        path: path.join(path.dirname(__filename), "../public" + url),
      });
    })
    if (post.meta.cover) {
      images.push({
        url: post.meta.cover,
        path: path.join(path.dirname(__filename), "../public" + post.meta.cover),
      });
    }
    if (post.meta.coverSquare) {
      images.push({
        url: post.meta.coverSquare,
        path: path.join(path.dirname(__filename), "../public" + post.meta.coverSquare),
      })
    }
  });

  for (const image of images) {
    await fUploadImage(image.url, image.path);
  }

  const postsDb = posts.map((post) => ({
    slug: post.slug,
    content: post.content,
    title: post.meta.title,
    description: post.meta.description,
    date: new Date(post.meta.date),
    excerpt: post.meta.excerpt,
    locale: post.meta.locale,
    cover: post.meta.cover || null,
    coverSquare: post.meta.coverSquare || null,
    lastModified: new Date(post.meta.lastModified),
    shortened: post.meta.shortened,
    shortExcerpt: post.meta.shortExcerpt || null,
  }));
  const tagsDb: { tag: string, slug: string }[] = [];
  const keywordsDb: { keyword: string, slug: string }[] = [];
  posts.forEach((post) => {
    const tags = post.meta.tags.map((tag) => ({
      slug: post.slug,
      tag,
    }));
    tagsDb.push(...tags);

    if (post.meta.keywords) {
      const keywords = post.meta.keywords?.map((keyword) => ({
        slug: post.slug,
        keyword,
      }));
      keywordsDb.push(...keywords);
    } else {
      const keywordTags = tags.map((tag) => ({
        slug: tag.slug,
        keyword: tag.tag,
      }))
      keywordsDb.push(...keywordTags);
    }
  });

  await Promise.all(postsDb.map((p) =>
    sql`
      INSERT INTO posts (slug, content, title, description, date, excerpt, locale, cover, coverSquare, lastModified, shortened, shortExcerpt)
      VALUES (${p.slug}, ${p.content}, ${p.title}, ${p.description}, ${p.date}, ${p.excerpt}, ${p.locale}, ${p.cover}, ${p.coverSquare}, ${p.lastModified}, ${p.shortened}, ${p.shortExcerpt})
      ON CONFLICT (slug) DO NOTHING;
    `
  ));

  await Promise.all(keywordsDb.map((k) =>
    sql`
      INSERT INTO post_keywords (slug, keyword)
      VALUES (${k.slug}, ${k.keyword})
      ON CONFLICT (slug, keyword) DO NOTHING;
    `
  ));

  await Promise.all(tagsDb.map((k) =>
    sql`
      INSERT INTO post_tags (slug, tag)
      VALUES (${k.slug}, ${k.tag})
      ON CONFLICT (slug, tag) DO NOTHING;
    `
  ));
} catch (error) {
  // Log error but don't fail the build
  console.log('Database connection failed, skipping table operations:', error);
}

exit(0);