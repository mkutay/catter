import remarkGfm from 'remark-gfm';
import remarkLint from 'remark-lint';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkCodeHike, recmaCodeHike, CodeHikeConfig } from 'codehike/mdx';
import { AnnotationHandler, highlight, Inline, InnerLine, InnerPre, InnerToken, Pre, RawCode } from 'codehike/code';
import Image, { ImageProps } from 'next/image';
import Link from 'next/link';
import { MDXComponents, MDXRemoteOptions } from 'next-mdx-remote-client/rsc';

import { siteConfig } from '@/config/site';

// CodeHike configuration for code blocks
const chConfig: CodeHikeConfig = {
  components: {
    code: 'MyCode',
    inlineCode: 'MyInlineCode',
  },
};

// Settings and plugins to use with MDXRemote to compile mdx files
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
    <div className="my-6 flex place-content-center">
      <Image {...props} alt={props.alt} className="my-0 lg:rounded-md rounded-sm"/>
    </div>
  ),
  Link: (props: any) => (
    <Link {...props} className="text-primary underline hover:text-primary/80 transition-all">
      {props.children}
    </Link>
  ),
  MyCode: async ({ codeblock }: { codeblock: RawCode }) => {
    const highlighted = await highlight(codeblock, "github-dark");
    return <Pre code={highlighted} handlers={[wordWrap, lineNumbers]} className="px-1 py-3 dark:bg-black/60 bg-black/80" />
  },
  MyInlineCode: async ({ codeblock }: { codeblock: RawCode }) => {
    const highlighted = await highlight(codeblock, "github-dark");
    return <Inline code={highlighted} style={highlighted.style} />
  },
};

// Handler for CodeHike to wrap code that exceeds the width.
export const wordWrap: AnnotationHandler = {
  name: "word-wrap",
  Pre: (props) => <InnerPre merge={props} className="whitespace-pre-wrap" />,
  Line: (props) => (
    <InnerLine merge={props}>
      <div
        style={{
          textIndent: `${-props.indentation}ch`,
          marginLeft: `${props.indentation}ch`,
        }}
      >
        {props.children}
      </div>
    </InnerLine>
  ),
  Token: (props) => <InnerToken merge={props} style={{ textIndent: 0 }} />,
}

// Handler for CodeHike to add line numbers.
export const lineNumbers: AnnotationHandler = {
  name: 'line-numbers',
  Line: (props) => {
    const width = props.totalLines.toString().length + 1;
    return (
      <div className="flex">
        <span
          className="text-right opacity-50 select-none"
          style={{ minWidth: `${width}ch` }}
        >
          {props.lineNumber}
        </span>
        <InnerLine merge={props} className="flex-1 pl-2" />
      </div>
    );
  },
}