import { MDXRemote } from 'next-mdx-remote/rsc';

import { siteConfig } from '@/config/site';
import { getProps } from '@/lib/postQueries';
import { components, options } from '@/lib/mdxRemoteSettings';
import DoublePane from '@/components/doublePane';

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
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
        {props.meta.title}
      </h1>
      <div id="mdxremote" className="text-right italic leading-7 [&:not(:first-child)]:mt-6 text-description">
        <MDXRemote source={props.meta.description} options={options} components={components}/>
      </div>
      <main id="mdxremote">
        <MDXRemote source={props.content} options={options} components={components}/>
      </main>
    </DoublePane>
  );
}