import remarkGfm from 'remark-gfm';
import remarkLint from 'remark-lint';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkCodeHike, recmaCodeHike } from 'codehike/mdx';
import { HighlightedCode, Pre } from 'codehike/code';
import Image, { ImageProps } from 'next/image';
import Link from 'next/link';
import { MDXComponents, MDXRemoteOptions } from 'next-mdx-remote-client/rsc';

import { siteConfig } from '@/config/site';

const chConfig = {
  components: { code: 'MyCode' },
  syntaxHighlighting: {
    theme: 'github-dark',
  },
};

export const options: MDXRemoteOptions = {
  mdxOptions: {
    baseUrl: siteConfig.url,
    remarkPlugins: [
      remarkGfm,
      remarkLint,
      remarkMath,
      [remarkCodeHike, chConfig],
    ],
    recmaPlugins: [
      [recmaCodeHike, chConfig],
    ],
    rehypePlugins: [rehypeKatex],
  }
};

export const components: MDXComponents = {
  Image: (props: ImageProps) => (
    <div className="my-8 flex place-content-center">
      <Image {...props} alt={props.alt} className="my-0"/>
    </div>
  ),
  Link: (props: any) => (
    <Link {...props} className="text-link underline hover:text-link/80">
      {props.children}
    </Link>
  ),
  MyCode: ({ codeblock }: { codeblock: HighlightedCode }) => (
    <div className="prose prose-pre:bg-slate-800 prose-pre:text-slate-50 my-6">
      <Pre code={codeblock}/>
    </div>
  ),
};