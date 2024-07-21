import Image from 'next/image';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { format } from 'date-fns';
import { Suspense } from 'react';

import { incrementViews } from '@/lib/dataBaseActions';
import ViewCounter from '@/components/viewCounter';
import Comment from '@/components/giscusComments';
import EmailSubButton from '@/components/emailSubButton';
import { siteConfig } from '@/config/site';
import { getPostFiles, getProps } from '@/lib/postQueries';
import { components, options } from '@/lib/mdxRemoteSettings';
import { MostViewedPosts } from '@/components/mostViewedPosts';

export function generateMetadata({ params }: { params: { slug: string } }) {
  const props = getProps('content/posts', params.slug);
  const formattedDate = format(props.meta.date, 'PP');

  return {
    title: props.meta.title,
    description: props.meta.description,
    keywords: props.meta.keywords ?? props.meta.tags,
    openGraph: {
      title: props.meta.title,
      description: props.meta.description,
      url: siteConfig.url + '/posts/' + props.slug,
      locale: props.meta.locale,
      type: 'article',
      publishedTime: formattedDate,
      images: [props.meta.coverSquare || 'images/favicon.png'],
    },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const props = getProps('content/posts', params.slug);
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
      <section className="justify-center my-8 px-4 prose-h1:my-0 flex lg:flex-row flex-col lg:gap-24 gap-0 lg:max-w-6xl max-w-prose mx-auto">
        <div className="lg:w-2/3 prose w-full lg:mx-0 mx-auto">
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
                <ViewCounter slug={props.slug}/>
              </Suspense>
              <span className="px-2 text-xl">
                ·
              </span>
              {props.meta.tags.map((tag: string) => (
                <span key={tag} className="text-[#5c5f77] dark:text-[#bac2de] prose-a:text-[#5c5f77] prose-a:dark:text-[#bac2de]">
                  [<Link href={`/tags/${tag}/page/1`}>{tag}</Link>]
                </span>
              ))}
            </div>
            <p className="my-4 italic text-right">
              {props.meta.description}
            </p>
          </header>
          <main>
            <MDXRemote source={props.content} options={options} components={components}/>
          </main>
          <hr/>
          <Comment/>
        </div>
        <div className="lg:w-1/3 prose w-full lg:mx-0 mx-auto prose-h1:mb-6 lg:prose-h1:my-0">
          <hr className="lg:hidden flex"/>
          <h1>
            Popular Content
          </h1>
          <hr className="hidden lg:flex"/>
          <Suspense>
            <MostViewedPosts postNum={Math.floor(siteConfig.postNumPerPage * 1.5)}/>
          </Suspense>
          <hr/>
          <EmailSubButton/>
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  const postFiles = getPostFiles();

  return postFiles.map(filename => ({
    slug: filename.replace('.mdx', ''),
  }));
}