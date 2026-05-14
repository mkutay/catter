import { type CodeHikeConfig, remarkCodeHike } from "codehike/mdx";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import type {
  EvaluateOptions,
  MDXComponents,
} from "next-mdx-remote-client/rsc";
import type {
  AnchorHTMLAttributes,
  BlockquoteHTMLAttributes,
  ComponentProps,
  DetailedHTMLProps,
  HTMLAttributes,
  ImgHTMLAttributes,
} from "react";
import recmaMdxImportReact from "recma-mdx-import-react";
import rehypeKatex from "rehype-katex";
import remarkFlexibleToc, { type TocItem } from "remark-flexible-toc";
import remarkGfm from "remark-gfm";
import remarkHeadingId from "remark-heading-id";
import remarkLint from "remark-lint";
import remarkMath from "remark-math";
import remarkSmartypants from "remark-smartypants";
import { ToggleParentheses } from "@/components/toggle-parentheses";
import {
  TypographyBlockquote,
  TypographyHr,
} from "@/components/typography/blockquote";
import { MyCode, MyInlineCode } from "@/components/typography/code-block";
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
} from "@/components/typography/headings";
import { TypographyOList, TypographyUList } from "@/components/typography/list";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { getPlaceholder } from "@/lib/images";
import rehypeKatexBlock from "@/lib/rehype-katex-block";
import remarkParentheses from "@/lib/remark-parentheses";
import { cn } from "@/lib/utils";

/**
 * CodeHike configuration for code blocks.
 */
const chConfig: CodeHikeConfig = {
  components: {
    code: "MyCode",
    inlineCode: "MyInlineCode",
  },
  /**
   * Ignore code blocks without a language specified or with "null" as the language.
   *
   * This prevents CodeHike from trying to process code blocks that are not meant to
   * be highlighted, while still allowing them to be rendered as plain text.
   *
   * This resolves the warning `Code Hike warning: Unknown language ""` for code
   * blocks without a language.
   */
  ignoreCode: (code) => {
    if (code.lang === "" || code.lang === null || code.lang === "null")
      code.lang = "txt";
    return false;
  },
};

/**
 * Type definition for the scope used in MDXRemote evaluation.
 *
 * Includes the table of contents (TOC) extracted from the vfile data.
 */
export type Scope = {
  toc?: TocItem[];
};

/**
 * Configuration options for MDXRemote evaluation.
 *
 * Includes plugins for GFM, Math/KaTeX, TOC, and custom remark/rehype transformations.
 */
export const options: EvaluateOptions<Scope> = {
  mdxOptions: {
    baseUrl: import.meta.url,
    remarkPlugins: [
      remarkGfm,
      remarkLint,
      remarkMath,
      [remarkCodeHike, chConfig],
      [remarkHeadingId, { defaults: true, uniqueDefaults: true }],
      [remarkFlexibleToc, { skipLevels: [] }],
      remarkSmartypants,
      remarkParentheses,
    ],
    rehypePlugins: [rehypeKatex, rehypeKatexBlock],
    recmaPlugins: [recmaMdxImportReact],
  },
  /**
   * This is to extract the table of contents(TOC) from the vfile data into the scope.
   */
  vfileDataIntoScope: "toc",
};

/**
 * Custom MDX components to be used globally across blog posts.
 *
 * Maps standard HTML elements and custom components to their styled React counterparts.
 */
export const components: MDXComponents = {
  Image: async (props: ImageProps) => {
    if (typeof props.src !== "string")
      return <Image {...props} alt={props.alt} />;

    type Placeholder = Awaited<ReturnType<typeof getPlaceholder>>;
    const placeholder: Placeholder = await getPlaceholder(props.src);

    const src = props.src.startsWith("/") ? props.src : `/${props.src}`;

    return (
      <Image
        {...props}
        alt={props.alt || ""}
        src={`/api${src}`}
        className={cn("my-8 lg:rounded-md rounded-sm", props.className)}
        width={placeholder.metadata.width}
        height={placeholder.metadata.height}
        placeholder={placeholder.base64 as `data:image/${string}`}
        quality={75}
      />
    );
  },
  img: async (
    props: DetailedHTMLProps<
      ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
  ) => {
    if (typeof props.src !== "string" || !props.src) return;

    const src = props.src.startsWith("/") ? props.src : `/${props.src}`;
    const placeholder = await getPlaceholder(props.src);

    return (
      <Image
        alt={props.alt || ""}
        src={`/api${src}`}
        className="my-8 lg:rounded-md rounded-sm"
        width={placeholder.metadata.width}
        height={placeholder.metadata.height}
        placeholder={placeholder.base64 as `data:image/${string}`}
        quality={75}
      />
    );
  },
  Link: (props: ComponentProps<typeof Link>) => (
    <Link
      {...props}
      className={cn(
        "text-primary underline hover:opacity-80 transition-opacity",
        props.className,
      )}
    >
      {props.children}
    </Link>
  ),
  a: (
    props: DetailedHTMLProps<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >,
  ) => {
    const { href, ...rest } = props;

    if (!href) {
      return (
        <span
          {...rest}
          className={cn(
            "text-primary underline hover:opacity-80 transition-opacity",
            props.className,
          )}
        >
          {props.children}
        </span>
      );
    }

    return (
      <Link
        href={href}
        {...rest}
        className={cn(
          "text-primary underline hover:opacity-80 transition-opacity",
          props.className,
        )}
      >
        {props.children}
      </Link>
    );
  },
  MyCode,
  MyInlineCode,
  code: (
    props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
  ) => (
    <MyInlineCode
      codeblock={{
        value: String(props.children),
        lang: "text",
        meta: "",
      }}
    />
  ),
  span: (
    props: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
  ) => {
    if (
      "data-math-block" in props ||
      props.className?.includes("katex-display")
    ) {
      /**
       * Wrap math blocks in a div with overflow-x-auto to allow
       * horizontal scrolling for wide equations.
       *
       * @see {@link rehypeKatexBlock}
       */
      return (
        <div className="overflow-x-auto overflow-y-hidden mx-auto w-fit max-w-full not-first:mt-6 block">
          <span {...props} />
        </div>
      );
    }
    return <span {...props} />;
  },
  div: (
    props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  ) => {
    if (
      "data-math-block" in props ||
      props.className?.includes("katex-display")
    ) {
      /**
       * Wrap math blocks in a div with overflow-x-auto to allow
       * horizontal scrolling for wide equations.
       *
       * @see {@link rehypeKatexBlock}
       */
      return (
        <div className="overflow-x-auto overflow-y-hidden mx-auto w-fit max-w-full not-first:mt-6 block">
          {props.children}
        </div>
      );
    }
    return <div {...props} />;
  },
  p: (
    props: DetailedHTMLProps<
      HTMLAttributes<HTMLParagraphElement>,
      HTMLParagraphElement
    >,
  ) => <TypographyParagraph {...props}>{props.children}</TypographyParagraph>,
  h1: (
    props: DetailedHTMLProps<
      HTMLAttributes<HTMLHeadingElement>,
      HTMLHeadingElement
    >,
  ) => <TypographyH1 {...props}>{props.children}</TypographyH1>,
  h2: (
    props: DetailedHTMLProps<
      HTMLAttributes<HTMLHeadingElement>,
      HTMLHeadingElement
    >,
  ) => <TypographyH2 {...props}>{props.children}</TypographyH2>,
  h3: (
    props: DetailedHTMLProps<
      HTMLAttributes<HTMLHeadingElement>,
      HTMLHeadingElement
    >,
  ) => <TypographyH3 {...props}>{props.children}</TypographyH3>,
  h4: (
    props: DetailedHTMLProps<
      HTMLAttributes<HTMLHeadingElement>,
      HTMLHeadingElement
    >,
  ) => <TypographyH4 {...props}>{props.children}</TypographyH4>,
  blockquote: (
    props: DetailedHTMLProps<
      BlockquoteHTMLAttributes<HTMLQuoteElement>,
      HTMLQuoteElement
    >,
  ) => <TypographyBlockquote {...props}>{props.children}</TypographyBlockquote>,
  ul: (
    props: DetailedHTMLProps<
      HTMLAttributes<HTMLUListElement>,
      HTMLUListElement
    >,
  ) => <TypographyUList {...props}>{props.children}</TypographyUList>,
  hr: (
    props: DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>,
  ) => <TypographyHr className={cn("my-12", props.className)} />,
  ToggleParentheses,
  ol: (
    props: DetailedHTMLProps<
      HTMLAttributes<HTMLOListElement>,
      HTMLOListElement
    >,
  ) => <TypographyOList {...props}>{props.children}</TypographyOList>,
};
