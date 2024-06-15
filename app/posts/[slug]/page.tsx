import path from 'path';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import fs from 'fs';
import matter from 'gray-matter';
import { parseISO, format } from 'date-fns';
import remarkGfm from 'remark-gfm';
import { getViewsCount, getLikesCount } from '@/app/lib/dataBaseQueries';
import { incrementViews, incrementLikes } from '@/app/lib/dataBaseActions';
import { Suspense } from 'react';
import ViewCounter from '@/app/ui/viewCounter';
import LikeButton from '@/app/ui/likeButton';
import Comment from '@/app/ui/giscusComments';

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  }
};

export function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const blog = getPost(params);

  return {
    title: blog.meta.title,
    description: blog.meta.description,
    openGraph: {
      title: blog.meta.title,
      description: blog.meta.description,
      url: 'https://www.mkutay.dev/posts/' + slug,
      locale: blog.meta.locale,
    },
  };
}

export default function Page({ params }: { params: { slug: string } } ) {
  const props = getPost(params);

  const formattedDate = format(props.meta.date, 'PP');

  incrementViews(props.slug);

  return (
    <section className="max-w-prose mx-auto my-0 py-8 sm:px-8 px-4 prose">
      <header>
        <h1>
          {props.meta.title}
        </h1>
        <hr/>
        <div className="text-lg font-semibold flex items-center text-[#4c4f69] dark:text-[#cdd6f4]">
          <div>
            {formattedDate}
          </div>
          <div className="px-2">
            ·
          </div>
          <div>
            <Suspense>
              <Views slug={props.slug}/>
            </Suspense>
          </div>
        </div>
        <p className="my-4 italic text-right">
          {props.meta.description}
        </p>
      </header>
      <main className="prose">
        <MDXRemote source={props.content} options={options}/>
      </main>
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
  const markdownFile = fs.readFileSync(path.join(process.cwd(), `app/posts/posts/${slug}.mdx`), 'utf-8');
  const { data: frontMatter, content } = matter(markdownFile);

  return {
    meta: frontMatter,
    slug: slug,
    content: content,
  };
}