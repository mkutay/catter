import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';

import DoublePane from '@/components/doublePane';
import { getProps } from '@/lib/contentQueries';
import { components, options } from '@/lib/mdxRemoteSettings';
import { siteConfig } from '@/config/site';
import me from '@/public/images/me.jpg';

export function generateMetadata() {
  const props = getProps('content/pages', 'about');

  return {
    title: props.meta.title,
    description: props.meta.description,
    openGraph: {
      title: props.meta.title,
      description: props.meta.description,
      url: siteConfig.url + '/' + props.slug,
    },
  };
}

export default async function Page() {
  const props = getProps('content/pages', 'about');

  return (
    <div>
      <div className="bg-secondary w-screen h-fit py-6 lg:space-y-16 lg:pt-24 pt-16 pb-6">
        <div className="lg:max-w-6xl max-w-prose px-4 mx-auto text-secondary-foreground lg:space-y-4 space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {props.meta.title}
          </h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            {props.meta.description}
          </p>
        </div>
      </div>
      <DoublePane>
        <div className="my-6">
          <Image
            alt={`${siteConfig.author} portrait image`}
            src={me}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            priority
            placeholder="blur"
            className="rounded-full shadow-md max-w-64 lg:float-right mx-auto"
          />
        </div>
        <main className="prose">
          <MDXRemote source={props.content} options={options} components={components}/>
        </main>
      </DoublePane>
    </div>
  );
}