import { ComponentProps, AnchorHTMLAttributes, BlockquoteHTMLAttributes, DetailedHTMLProps, HTMLAttributes, ImgHTMLAttributes, Children, isValidElement, ReactElement } from 'react';
import { EvaluateOptions, MDXComponents } from 'next-mdx-remote-client/rsc';
import { remarkCodeHike, CodeHikeConfig } from 'codehike/mdx';
import recmaMdxImportReact from 'recma-mdx-import-react';
import remarkFlexibleToc from "remark-flexible-toc";
import remarkSmartypants from 'remark-smartypants';
import remarkHeadingId from 'remark-heading-id';
import Image, { ImageProps } from 'next/image';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkLint from 'remark-lint';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

import { TypographyH1, TypographyH2, TypographyH3, TypographyH4 } from '@/components/typography/headings';
import { TypographyBlockquote, TypographyHr } from '@/components/typography/blockquote';
import { MyCode, MyInlineCode } from '@/components/typography/code-block';
import { TypographyParagraph } from '@/components/typography/paragraph';
import { ToggleParentheses } from '@/components/toggleParentheses';
import { TypographyOList, TypographyUList } from '@/components/typography/list';
import { cn } from '@/lib/utils';
import { getPlaceholder } from '@/lib/images';
import remarkParentheses from '@/lib/remarkParentheses';

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
      [remarkFlexibleToc, { skipLevels: [] }],
      remarkParentheses,
      remarkSmartypants,
    ],
    rehypePlugins: [rehypeKatex],
    recmaPlugins: [recmaMdxImportReact],
  },
};

export const components: MDXComponents = {
  Image: async (props: ImageProps) => {
    if (typeof props.src !== "string") return <Image {...props} alt={props.alt} />;
    
    type Placeholder = Awaited<ReturnType<typeof getPlaceholder>>;
    const placeholder: Placeholder = await getPlaceholder(props.src);

    const src = props.src.startsWith('/') ? props.src : `/${props.src}`;

    return <Image
      {...props}
      alt={props.alt || ''}
      src={`/api${src}`}
      className={cn("my-8 lg:rounded-md rounded-sm", props.className)}
      width={placeholder.metadata.width}
      height={placeholder.metadata.height}
      placeholder={placeholder.base64 as `data:image/${string}`}
      quality={50}
    />;
  },
  img: async (props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
    if (!props.src) return;
    const placeholder = await getPlaceholder(props.src);
    const src = props.src.startsWith('/') ? props.src : `/${props.src}`;

    return <Image
      alt={props.alt || ''}
      src={`/api${src}`}
      className="my-8 lg:rounded-md rounded-sm"
      width={placeholder.metadata.width}
      height={placeholder.metadata.height}
      placeholder={placeholder.base64 as `data:image/${string}`}
      quality={50}
    />;
  },
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
  p: (
    props: DetailedHTMLProps<
      HTMLAttributes<HTMLParagraphElement>,
      HTMLParagraphElement
    >
  ) => {
    const childrenArray = Children.toArray(props.children);

    // this is SO DUBIOUS but it works
    // and i give up on trying to find a better way
    const isOnlyKatex =
      childrenArray.length === 1 &&
      isValidElement(childrenArray[0]) &&
      childrenArray[0].type === "span" &&
      typeof (childrenArray[0] as ReactElement<HTMLSpanElement>).props.className === "string" &&
      ((childrenArray[0] as ReactElement<HTMLSpanElement>).props.className as string)
        .split(" ")
        .includes("katex");

    return (
      <TypographyParagraph
        {...props}
        className={cn(isOnlyKatex && "mx-auto w-fit", props.className)}
      >
        {props.children}
      </TypographyParagraph>
    );
  },
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
    <TypographyHr className={cn("my-12", props.className)} />
  ),
  ToggleParentheses,
  ol: (props: DetailedHTMLProps<HTMLAttributes<HTMLOListElement>, HTMLOListElement>) => (
    <TypographyOList {...props}>
      {props.children}
    </TypographyOList>
  ),
};