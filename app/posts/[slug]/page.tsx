import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import fs from 'fs';
import matter from 'gray-matter';
import { parseISO, format } from 'date-fns';
import remarkGfm from 'remark-gfm';
import remarkLint from 'remark-lint';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { getViewsCount, getLikesCount } from '@/app/lib/dataBaseQueries';
import { incrementViews, incrementLikes } from '@/app/lib/dataBaseActions';
import { Suspense } from 'react';
import ViewCounter from '@/app/ui/viewCounter';
import LikeButton from '@/app/ui/likeButton';
import Comment from '@/app/ui/giscusComments';
import { notFound } from 'next/navigation';

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkLint, remarkMath],
    rehypePlugins: [rehypeKatex],
  }
};

export function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const blog = getPost(params);

  return {
    title: blog.meta.title,
    description: blog.meta.description,
    keywords: blog.meta.tags,
    openGraph: {
      title: blog.meta.title,
      description: blog.meta.description,
      url: 'https://www.mkutay.dev/posts/' + slug,
      locale: blog.meta.locale,
    },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const props = getPost(params);

  const formattedDate = format(props.meta.date, 'PP');

  incrementViews(props.slug);

  return (
    <section className="max-w-prose mx-auto my-0 py-8 sm:px-8 px-4 prose prose-h1:my-0">
      <header>
        <h1>
          {props.meta.title}
        </h1>
        <hr/>
        <div className="text-lg font-semibold text-[#4c4f69] dark:text-[#cdd6f4]">
          <span>
            {formattedDate}
          </span>
          <span className="px-2 text-xl">
            ·
          </span>
          <Suspense>
            <Views slug={props.slug}/>
          </Suspense>
          <span className="px-2 text-xl">
            ·
          </span>
          {props.meta.tags.map((tag: string) => (
            <span className="text-[#5c5f77] dark:text-[#bac2de]" key={tag}>
              [{tag}]
            </span>
          ))}
        </div>
        <p className="my-4 italic text-right">
          {props.meta.description}
        </p>
      </header>
      <main className="prose">
        <MDXRemote source={props.content} options={options}/>
      </main>
      <hr/>
      <Comment/>
    </section>
  );
}

async function Views({ slug }: { slug: string }) {
  let views = await getViewsCount();

  return <ViewCounter allViews={views} slug={slug}/>;
}

async function Likes({ slug }: { slug: string }) {
  let likes = await getLikesCount();

  return <LikeButton allLikes={likes} slug={slug}/>;
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'app/posts/posts'));

  return files.map(filename => ({
    slug: filename.replace('.mdx', ''),
  }));
}

function getPost({ slug }: { slug : string }) {
  let markdownFile;
  try {
    markdownFile = fs.readFileSync(path.join(process.cwd(), `app/posts/posts/${slug}.mdx`), 'utf-8');
  } catch(error) {
    notFound();
  }
  const { data: frontMatter, content } = matter(markdownFile);

  return {
    meta: frontMatter,
    slug: slug,
    content: content,
  };
}
