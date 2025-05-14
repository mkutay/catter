import { MDXRemote } from "next-mdx-remote-client/rsc";
import Image from 'next/image';

import { TypographyH1 } from "@/components/typography/headings";
import { components, options } from '@/config/mdxRemoteSettings';
import { getAboutProps } from '@/lib/contentQueries';
import DoublePane from '@/components/doublePane';
import { siteConfig } from '@/config/site';
import me from '@/public/images/me.jpg';

export const dynamic = 'force-static';

export function generateMetadata() {
  const props = getAboutProps();

  return {
    title: props.meta.title,
    description: props.meta.description,
    openGraph: {
      title: props.meta.title,
      description: props.meta.description,
      url: siteConfig.url + '/about',
    },
  };
}

export default async function Page() {
  const props = getAboutProps();

  return (
    <div>
      <div className="bg-primary w-screen h-fit py-6 lg:space-y-16 lg:pt-24 pt-16 pb-6">
        <div className="lg:max-w-6xl max-w-prose px-4 mx-auto text-primary-foreground lg:space-y-4 space-y-2">
          <TypographyH1>{props.meta.title}</TypographyH1>
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
            placeholder="blur"
            className="rounded-full shadow-md max-w-64 lg:float-right mx-auto"
          />
        </div>
        <main>
          <MDXRemote source={props.content} options={options} components={components}/>
        </main>
      </DoublePane>
    </div>
  );
}