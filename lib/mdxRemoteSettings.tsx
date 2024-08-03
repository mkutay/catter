import remarkGfm from 'remark-gfm';
import remarkLint from 'remark-lint';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehyprehypeHighlightLines from 'rehype-highlight-code-lines';
import Image from 'next/image';
import Link from 'next/link';

export const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkLint, remarkMath],
    rehypePlugins: [rehypeKatex, rehypeHighlight, rehyprehypeHighlightLines],
  }
};

export const components = {
  Image: (props: any) => (
    <div className="my-8 flex place-content-center">
      <Image {...props} alt={props.alt} className="my-0"/>
    </div>
  ),
  Link: (props: any) => (
    <Link {...props} className="text-link underline hover:text-link/80">
      {props.children}
    </Link>
  ),
};