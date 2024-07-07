import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import fs from 'fs';
import matter from 'gray-matter';
import { format } from 'date-fns';
import remarkGfm from 'remark-gfm';
import remarkLint from 'remark-lint';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { getViewsCount } from '@/app/lib/dataBaseQueries';
import { incrementViews } from '@/app/lib/dataBaseActions';
import { Suspense } from 'react';
import ViewCounter from '@/components/viewCounter';
import Comment from '@/components/giscusComments';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import EmailSubButton from '@/components/emailSubButton';
import { siteConfig } from '@/config/site';

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkLint, remarkMath],
    rehypePlugins: [rehypeKatex],
  }
};

const components = {
  Image: (props: any) => (
    <div className="my-8 flex place-content-center">
      <Image {...props} alt={props.alt} className="my-0"/>
    </div>
  ),
  Link: (props: any) => (
    <Link {...props}>
      {props.children}
    </Link>
  ),
};

export function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const blog = getPost(params);
  const formattedDate = format(blog.meta.date, 'PP');

  const coverSquare = blog.meta.coverSquare || 'images/favicon.png';

  return {
    title: blog.meta.title,
    description: blog.meta.description,
    keywords: blog.meta.tags,
    openGraph: {
      title: blog.meta.title,
      description: blog.meta.description,
      url: siteConfig.url + '/posts/' + slug,
      locale: blog.meta.locale,
      type: 'article',
      publishedTime: formattedDate,
      images: [coverSquare],
    },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const props = getPost(params);

  const formattedDate = format(props.meta.date, 'PP');

  incrementViews(props.slug);

  return (
    <div className="my-8">
      {props.meta.cover && (<Image
        alt={`${props.meta.title} post cover image`}
        src={props.meta.cover}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        className="max-w-4xl mx-auto mb-8 pt-2"
      />)}
      <section className="max-w-prose mx-auto px-4 prose prose-h1:my-0">
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
              <span key={tag} className="text-[#5c5f77] dark:text-[#bac2de]">
                [ <Link className="text-[#5c5f77] dark:text-[#bac2de]" href={`/tags/${tag}`}>{tag}</Link> ]
              </span>
            ))}
          </div>
          <p className="my-4 italic text-right">
            {props.meta.description}
          </p>
        </header>
        <main className="prose">
          <MDXRemote source={props.content} options={options} components={components}/>
        </main>
        <hr/>
        <EmailSubButton/>
        <hr/>
        <Suspense>
          <Comment/>
        </Suspense>
      </section>
    </div>
  );
}

async function Views({ slug }: { slug: string }) {
  let views = await getViewsCount();

  return <ViewCounter allViews={views} slug={slug}/>;
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'content/posts'));

  return files.map(filename => ({
    slug: filename.replace('.mdx', ''),
  }));
}

function getPost({ slug }: { slug : string }) {
  let markdownFile;
  try {
    markdownFile = fs.readFileSync(path.join(process.cwd(), `content/posts/${slug}.mdx`), 'utf-8');
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
