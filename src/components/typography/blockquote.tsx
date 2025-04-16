import { BlockquoteHTMLAttributes, DetailedHTMLProps } from 'react';

import { cn } from '@/lib/utils';

export function TypographyBlockquote(props: DetailedHTMLProps<BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>) {
  return (
    <blockquote className={cn("mt-6 border-l-2 pl-6 italic", props.className)} {...props}>
      {props.children}
    </blockquote>
  );
}