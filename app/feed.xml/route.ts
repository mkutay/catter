import Rss from 'rss';
import getPosts from '@/app/lib/getPosts';

export async function GET() {
  const feed = new Rss({
    title: 'Kutay\'s Blog',
    description: 'A blog where uni student Kutay posts about things he likes, from maths to computer science',
    generator: 'RSS for Node and Next.js',
    feed_url: 'https://www.mkutay.dev/feed.xml',
    site_url: 'https://www.mkutay.dev/',
    managingEditor: 'Mehmet Kutay Bozkurt <hello@mkutay.dev>',
    webMaster: 'Mehmet Kutay Bozkurt <hello@mkutay.dev>',
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
      author: 'Mehmet Kutay Bozkurt <hello@mkutay.dev>',
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}