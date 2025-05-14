import { DetailedHTMLProps, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function TypographyH1(props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  return (
    <h1 {...props} className={cn("scroll-m-20 text-4xl font-normal italic tracking-tight lg:text-5xl [&:not(:first-child)]:mt-12", props.className)}>
      {props.children}
    </h1>
  );
}

export function TypographyH2(props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  return (
    <h2 {...props} className={cn("mt-10 scroll-m-20 lg:text-4xl text-3xl font-semibold tracking-tighter first:mt-0", props.className)}>
      {props.children}
    </h2>
  );
}

export function TypographyH3(props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  return (
    <h3 {...props} className={cn("mt-8 scroll-m-20 text-2xl font-semibold tracking-tight", props.className)}>
      {props.children}
    </h3>
  );
}

export function TypographyH4(props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  return (
    <h4 {...props} className={cn("scroll-m-20 text-xl font-semibold tracking-tight", props.className)}>
      {props.children}
    </h4>
  );
}

export function TypographyH5(props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  return (
    <h5 {...props} className={cn("scroll-m-20 text-lg font-medium tracking-tight", props.className)}>
      {props.children}
    </h5>
  );
}