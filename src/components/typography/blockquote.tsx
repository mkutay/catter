import { BlockquoteHTMLAttributes, DetailedHTMLProps } from 'react';

import { cn } from '@/lib/utils';

export function TypographyBlockquote(props: DetailedHTMLProps<BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>) {
  return (
    <blockquote className={cn("mt-6 border-l-2 pl-6 italic", props.className)} {...props}>
      {props.children}
    </blockquote>
  );
}

export function TypographyHr({ className }: { className?: string }) {
  return <div className={cn("inline-flex items-center justify-between w-full my-6", className)}>
    <hr className={cn("h-0.5 bg-secondary border-0 w-full")} />
    <span className="px-12 text-xl text-secondary-foreground">§</span>
    <hr className={cn("h-0.5 bg-secondary border-0 w-full")} />
  </div>;
}