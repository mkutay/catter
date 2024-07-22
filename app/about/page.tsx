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
    </DoublePane>
  );
}