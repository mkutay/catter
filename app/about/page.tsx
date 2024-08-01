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
    <DoublePane>
      <h1>
        {props.meta.title}
      </h1>
      <p className="text-right italic not-prose text-description">
        {props.meta.description}
      </p>
      <Image
        alt={`${siteConfig.author} portrait image`}
        src={me}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        priority
        placeholder="blur"
        className="rounded-full shadow-md max-w-64 float-right lg:flex hidden"
      />
      <main>
        <MDXRemote source={props.content} options={options} components={components}/>
      </main>
      <Image
        alt={`${siteConfig.author} portrait image`}
        src={me}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        priority
        placeholder="blur"
        className="rounded-full shadow-md max-w-64 lg:hidden flex mx-auto"
      />
    </DoublePane>
  );
}