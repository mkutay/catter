import { MDXRemote } from 'next-mdx-remote/rsc';

import { siteConfig } from '@/config/site';
import { getProps } from '@/lib/postQueries';
import { components, options } from '@/lib/mdxRemoteSettings';

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
    <div className="max-w-prose mx-auto my-8 prose px-4 prose-h1:my-0">
      <h1>
        {props.meta.title}
      </h1>
      <hr/>
      <div className="mb-4 text-right italic">
        <MDXRemote source={props.meta.description} options={options} components={components}/>
      </div>
      <main>
        <MDXRemote source={props.content} options={options} components={components}/>
      </main>
    </div>
  );
}