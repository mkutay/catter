import Rss from 'rss';

import { getPosts } from '@/lib/dbContentQueries';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-static';

export async function GET() {
  const feed = new Rss({
    title: siteConfig.name,
    description: siteConfig.description,
    generator: 'RSS for Node and Next.js',
    feed_url: `${siteConfig.url}/feed.xml`,
    site_url: siteConfig.url,
    managingEditor: `${siteConfig.authorEmail} (${siteConfig.author})`,
    webMaster: `${siteConfig.authorEmail} (${siteConfig.author})`,
    copyright: `Copyright ${new Date().getFullYear().toString()}, ${siteConfig.author}`,
    language: 'en-UK',
    pubDate: new Date().toISOString().split('T')[0],
    ttl: 60,
  });

  const posts = await getPosts({ });
  if (posts.isErr()) throw new Error(posts.error.message);

  posts.value.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      url: `${siteConfig.url}/posts/${post.slug}`,
      date: new Date(post.date).toISOString().split('T')[0],
      author: `${siteConfig.authorEmail} (${siteConfig.author})`,
      categories: post.tags || [],
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}