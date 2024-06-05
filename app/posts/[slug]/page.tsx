import path from 'path';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import fs from 'fs';
import matter from 'gray-matter';
import { parseISO, format } from 'date-fns';

export function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const blog = getPost(params);

  return {
    title: blog.meta.title,
    description: blog.meta.description,
    openGraph: {
      title: blog.meta.title,
      description: blog.meta.description,
      url: 'https://mkutay.dev/posts/' + slug,
    },
  };
}

export default function Page({ params }: { params: { slug: string } } ) {
  const props = getPost(params);

  const formattedDate = format(props.meta.date, 'PP')

  return (
    <div className="max-w-prose mx-auto my-0 py-8">
      <header>
        <h1 className="font-bold text-3xl mb-4">
          {props.meta.title}
        </h1>
        <p className="my-4 font-semibold">
          {formattedDate}
        </p>
        <p className="my-4 italic text-right">
          {props.meta.description}
        </p>
      </header>
      <main className="prose">
        <MDXRemote source={props.content}/>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'app/posts/posts'));

  return files.map(filename => ({
    slug: filename.replace('.mdx', ''),
  }));
}

function getPost({ slug }: { slug : string }) {
  const markdownFile = fs.readFileSync(path.join(process.cwd(), `app/posts/posts/${slug}.mdx`), 'utf-8');
  const { data: frontMatter, content } = matter(markdownFile);

  return {
    meta: frontMatter,
    slug: slug,
    content: content,
  };
}