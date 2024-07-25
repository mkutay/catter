import Image from 'next/image';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { format } from 'date-fns';

import { getProjectFiles, getProps } from "@/lib/projectQueries";
import Comment from '@/components/post/giscusComments';
import { siteConfig } from '@/config/site';
import { components, options } from '@/lib/mdxRemoteSettings';
import DoublePane from '@/components/doublePane';
import CopyToClipboard from '@/components/copyToClipboard';

export function generateMetadata({ params }: { params: { slug: string } }) {
  const props = getProps('content/projects', params.slug);
  const formattedDate = format(props.meta.date, 'PP');

  return {
    title: props.meta.title,
    description: props.meta.description,
    keywords: props.meta.keywords ?? props.meta.tags,
    openGraph: {
      title: props.meta.title,
      description: props.meta.description,
      url: siteConfig.url + '/projects/' + props.slug,
      locale: props.meta.locale,
      type: 'article',
      publishedTime: formattedDate,
      images: [props.meta.coverSquare || 'images/favicon.png'],
    },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const props = getProps('content/projects', params.slug);
  const formattedDate = format(props.meta.date, 'PP');

  return (
    <div className="my-8">
      {props.meta.cover && (<Image
        alt={`${props.meta.title} post cover image`}
        src={props.meta.cover}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        className="max-w-4xl mx-auto pt-2"
      />)}
      <DoublePane>
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
            {props.meta.tags.map((tag: string) => (
              <span key={tag} className="text-[#5c5f77] dark:text-[#bac2de] prose-a:text-[#5c5f77] prose-a:dark:text-[#bac2de]">
                [<Link href={`/tags/${tag}/page/1`}>{tag}</Link>]
              </span>
            ))}
          </div>
          <div className="my-4 flex flex-row items-center gap-4 justify-end text-text text-lg">
            <CopyToClipboard text={props.meta.shortened}/>
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
      </DoublePane>
    </div>
  );
}

export async function generateStaticParams() {
  const projectFiles = getProjectFiles();

  return projectFiles.map(filename => ({
    slug: filename.replace('.mdx', ''),
  }));
}