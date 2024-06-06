import path from 'path';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import fs from 'fs';
import matter from 'gray-matter';
import { parseISO, format } from 'date-fns';
import ListOfPosts from '@/app/ui/listOfPosts';
import remarkGfm from 'remark-gfm';

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  }
};

export function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const blog = getPage(params);

  return {
    title: blog.meta.title,
    description: blog.meta.description,
    openGraph: {
      title: blog.meta.title,
      description: blog.meta.description,
      url: 'https://www.mkutay.dev/posts/' + slug,
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const props = getPage(params);

  return (
    <div className="max-w-prose mx-auto my-0 py-8 prose px-4 sm:px-8">
      <h1 className="">
        {props.meta.title}
      </h1>
      <p className="my-4 text-right italic">
        {props.meta.description}
      </p>
      <main>
        <MDXRemote source={props.content} components={{ListOfPosts}} options={options}/>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'app/pages/pages'));

  return files.map(filename => ({
    slug: filename.replace('.mdx', ''),
  }));
}

function getPage({ slug }: { slug : string }) {
  const markdownFile = fs.readFileSync(path.join(process.cwd(), `app/pages/pages/${slug}.mdx`), 'utf-8');
  const { data: frontMatter, content } = matter(markdownFile);

  return {
    meta: frontMatter,
    slug: slug,
    content: content,
  };
}