import Rss from 'rss';
import getPosts from '@/app/lib/getPosts';
import fs from 'fs';
import path from 'path';

export default function writeRss() {
  const feed = new Rss({
    title: 'Kutay\'s Blog',
    description: 'A blog where uni student Kutay posts about things he likes, from maths to computer science',
    generator: 'RSS for Node and Next.js',
    feed_url: 'https://www.mkutay.dev/feed.xml',
    site_url: 'https://www.mkutay.dev/',
    managingEditor: 'hello@mkutay.dev (Mehmet Kutay Bozkurt)',
    webMaster: 'hello@mkutay.dev (Mehmet Kutay Bozkurt)',
    copyright: `Copyright ${new Date().getFullYear().toString()}, Mehmet Kutay Bozkurt`,
    language: 'en-UK',
    pubDate: new Date().toUTCString(),
    ttl: 60,
  });

  const posts = getPosts(0, 100000);

  posts.forEach((post) => {
    feed.item({
      title: post.meta.title,
      description: post.meta.description,
      url: `https://mkutay.dev/posts/${post.slug}`,
      date: post.meta.date,
      author: 'hello@mkutay.dev (Mehmet Kutay Bozkurt)',
      categories: post.meta.tags || [],
    });
  });

  fs.writeFileSync(path.join(process.cwd(), 'public/feed.xml'), feed.xml({ indent: true }));
}