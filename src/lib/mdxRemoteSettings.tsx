import remarkGfm from 'remark-gfm';
import remarkLint from 'remark-lint';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkCodeHike, recmaCodeHike, CodeHikeConfig } from 'codehike/mdx';
import { AnnotationHandler, highlight, Inline, InnerLine, InnerPre, InnerToken, Pre, RawCode } from 'codehike/code';
import Image, { ImageProps } from 'next/image';
import Link from 'next/link';
import { MDXComponents, MDXRemoteOptions } from 'next-mdx-remote-client/rsc';
import { ComponentProps, AnchorHTMLAttributes, BlockquoteHTMLAttributes, DetailedHTMLProps, HTMLAttributes, ImgHTMLAttributes } from 'react';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { postImages } from '@/config/images';

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
  img: (props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => (
    <Image
      alt={props.alt || ''}
      src={postImages[props.src || '']}
      className="my-6 lg:rounded-md rounded-sm"
      sizes="100vw"
      style={{
        width: '100%',
        height: 'auto',
      }}
      placeholder="blur"
    />
  ),
  Link: (props: ComponentProps<typeof Link>) => (
    <Link {...props} className={cn("text-primary underline hover:text-primary/80 transition-all", props.className)}>
      {props.children}
    </Link>
  ),
  a: (props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => {
    const { href, ...rest } = props;
    
    if (!href) {
      return <span {...rest} className={cn("text-primary underline hover:text-primary/80 transition-all", props.className)}>
        {props.children}
      </span>;
    }
    
    return <Link href={href} {...rest} className={cn("text-primary underline hover:text-primary/80 transition-all", props.className)}>
      {props.children}
    </Link>
  },
  MyCode: async ({ codeblock }: { codeblock: RawCode }) => {
    const highlighted = await highlight(codeblock, "github-dark");
    return <Pre code={highlighted} handlers={[wordWrap, lineNumbers]} className="mt-6 px-1 py-3 rounded-lg bg-[#0d1117]" />
  },
  MyInlineCode: async ({ codeblock }: { codeblock: RawCode }) => {
    const highlighted = await highlight(codeblock, "github-dark");
    return <Inline code={highlighted} style={highlighted.style} className="px-1 py-0.5 rounded-sm" />
  },
  p: (props: DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>) => (
    <p {...props} className={cn("font-normal leading-7 [&:not(:first-child)]:mt-6", props.className)}>
      {props.children}
    </p>
  ),
  h1: (props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => (
    <h1 {...props} className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl [&:not(:first-child)]:mt-12", props.className)}>
      {props.children}
    </h1>
  ),
  h2: (props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => (
    <h2 {...props} className={cn("mt-10 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0", props.className)}>
      {props.children}
    </h2>
  ),
  h3: (props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => (
    <h3 {...props} className={cn("mt-8 scroll-m-20 text-2xl font-semibold tracking-tight", props.className)}>
      {props.children}
    </h3>
  ),
  h4: (props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => (
    <h4 {...props} className={cn("scroll-m-20 text-xl font-semibold tracking-tight", props.className)}>
      {props.children}
    </h4>
  ),
  blockquote: (props: DetailedHTMLProps<BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>) => (
    <blockquote {...props} className={cn("mt-4 border-l-2 border-foreground pl-6 italic", props.className)}>
      {props.children}
    </blockquote>
  ),
  ul: (props: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>) => (
    <ul {...props} className={cn("my-6 ml-6 list-disc [&>li]:mt-2", props.className)}>
      {props.children}
    </ul>
  ),
  hr: (props: DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>) => (
    <hr {...props} className="my-6 border-t-2 border-muted" />
  ),
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
          className="text-right select-none"
          style={{ minWidth: `${width}ch` }}
        >
          {props.lineNumber}
        </span>
        <InnerLine merge={props} className="flex-1 pl-2" />
      </div>
    );
  },
}