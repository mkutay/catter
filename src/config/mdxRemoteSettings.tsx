import { ComponentProps, AnchorHTMLAttributes, BlockquoteHTMLAttributes, DetailedHTMLProps, HTMLAttributes, ImgHTMLAttributes } from 'react';
import { EvaluateOptions, MDXComponents } from 'next-mdx-remote-client/rsc';
import { remarkCodeHike, CodeHikeConfig } from 'codehike/mdx';
import recmaMdxImportReact from 'recma-mdx-import-react';
import remarkFlexibleToc from "remark-flexible-toc";
import Image, { ImageProps } from 'next/image';
import remarkHeadingId from 'remark-heading-id';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkLint from 'remark-lint';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

import { TypographyH1, TypographyH2, TypographyH3, TypographyH4 } from '@/components/typography/headings';
import { TypographyBlockquote } from '@/components/typography/blockquote';
import { MyCode, MyInlineCode } from '@/components/typography/code-block';
import { TypographyParagraph } from '@/components/typography/paragraph';
import { ToggleParentheses } from '@/components/toggleParentheses';
import { TypographyOList, TypographyUList } from '@/components/typography/list';
import { postImages } from '@/config/images';
import { cn } from '@/lib/utils';

// CodeHike configuration for code blocks
const chConfig: CodeHikeConfig = {
  components: {
    code: 'MyCode',
    inlineCode: 'MyInlineCode',
  },
};

// Settings and plugins to use with MDXRemote to compile mdx files
export const options: EvaluateOptions = {
  mdxOptions: {
    baseUrl: import.meta.url,
    remarkPlugins: [
      remarkGfm,
      remarkLint,
      remarkMath,
      [remarkCodeHike, chConfig],
      [remarkHeadingId, { defaults: true, uniqueDefaults: true }],
      remarkFlexibleToc,
    ],
    rehypePlugins: [rehypeKatex],
    recmaPlugins: [
      recmaMdxImportReact,
    ]
  },
};

export const components: MDXComponents = {
  Image: (props: ImageProps) => (
    <Image
      alt={props.alt || ''}
      src={postImages[props.src as string]}
      className={cn("my-6 lg:rounded-md rounded-sm", props.className)}
      sizes="100vw"
      style={props.style || {
        width: '100%',
        height: 'auto',
      }}
      placeholder="blur"
      quality={45}
    />
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
      quality={45}
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
  MyCode,
  MyInlineCode,
  p: (props: DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>) => (
    <TypographyParagraph {...props}>
      {props.children}
    </TypographyParagraph>
  ),
  h1: (props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => (
    <TypographyH1 {...props}>
      {props.children}
    </TypographyH1>
  ),
  h2: (props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => (
    <TypographyH2 {...props}>
      {props.children}
    </TypographyH2>
  ),
  h3: (props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => (
    <TypographyH3 {...props}>
      {props.children}
    </TypographyH3>
  ),
  h4: (props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => (
    <TypographyH4 {...props}>
      {props.children}
    </TypographyH4>
  ),
  blockquote: (props: DetailedHTMLProps<BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>) => (
    <TypographyBlockquote {...props}>
      {props.children}
    </TypographyBlockquote>
  ),
  ul: (props: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>) => (
    <TypographyUList {...props}>
      {props.children}
    </TypographyUList>
  ),
  hr: (props: DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>) => (
    <hr {...props} className={cn("my-6 border-t-2 border-muted", props.className)} />
  ),
  ToggleParentheses: (props: { children: React.ReactNode }) => (
    <ToggleParentheses>
      {props.children}
    </ToggleParentheses>
  ),
  ol: (props: DetailedHTMLProps<HTMLAttributes<HTMLOListElement>, HTMLOListElement>) => (
    <TypographyOList {...props}>
      {props.children}
    </TypographyOList>
  ),
};