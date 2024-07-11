import Rss from 'rss';
import getPosts from '@/app/lib/getPosts';
import { siteConfig } from '@/config/site';

export async function GET() {
  const feed = new Rss({
    title: 'Kutay\'s Blog',
    description: 'A blog where uni student Kutay posts about things he likes, from maths to computer science',
    generator: 'RSS for Node and Next.js',
    feed_url: `${siteConfig.url}/feed.xml`,
    site_url: siteConfig.url,
    managingEditor: 'hello@mkutay.dev (Mehmet Kutay Bozkurt)',
    webMaster: 'hello@mkutay.dev (Mehmet Kutay Bozkurt)',
    copyright: `Copyright ${new Date().getFullYear().toString()}, Mehmet Kutay Bozkurt`,
    language: 'en-UK',
    pubDate: new Date().toUTCString(),
    ttl: 60,
  });

  const posts = getPosts({ });

  posts.forEach((post) => {
    feed.item({
      title: post.meta.title,
      description: post.meta.description,
      url: `${siteConfig.url}/posts/${post.slug}`,
      date: post.meta.date,
      author: 'hello@mkutay.dev (Mehmet Kutay Bozkurt)',
      categories: post.meta.tags || [],
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}