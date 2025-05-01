import { ComponentProps, AnchorHTMLAttributes, BlockquoteHTMLAttributes, DetailedHTMLProps, HTMLAttributes, ImgHTMLAttributes } from 'react';
import { MDXComponents, MDXRemoteOptions } from 'next-mdx-remote-client/rsc';
import { remarkCodeHike, CodeHikeConfig } from 'codehike/mdx';
import Image, { ImageProps } from 'next/image';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkLint from 'remark-lint';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { postImages } from '@/config/images';
import { TypographyParagraph } from '@/components/typography/paragraph';
import { TypographyH1, TypographyH2, TypographyH3, TypographyH4 } from '@/components/typography/headings';
import { TypographyBlockquote } from '@/components/typography/blockquote';
import { TypographyList } from '@/components/typography/list';
import { MyCode, MyInlineCode } from '@/components/typography/code-block';
import { ToggleParentheses } from '@/components/toggleParentheses';

// CodeHike configuration for code blocks
const chConfig: CodeHikeConfig = {
  components: {
    code: 'MyCode',
    inlineCode: 'MyInlineCode',
  },
  syntaxHighlighting: {
    theme: 'github-dark',
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
    <TypographyList {...props}>
      {props.children}
    </TypographyList>
  ),
  hr: (props: DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>) => (
    <hr {...props} className={cn("my-6 border-t-2 border-muted", props.className)} />
  ),
  ToggleParentheses: (props: { children: React.ReactNode }) => (
    <ToggleParentheses>
      {props.children}
    </ToggleParentheses>
  )
};