import { DetailedHTMLProps, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function TypographyH1(props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  return (
    <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl [&:not(:first-child)]:mt-12", props.className)} {...props}>
      {props.children}
    </h1>
  );
}

export function TypographyH2(props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  return (
    <h2 className={cn("mt-10 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0", props.className)} {...props}>
      {props.children}
    </h2>
  );
}

export function TypographyH3(props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  return (
    <h3 className={cn("mt-8 scroll-m-20 text-2xl font-semibold tracking-tight", props.className)} {...props}>
      {props.children}
    </h3>
  );
}

export function TypographyH4(props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  return (
    <h4 className={cn("scroll-m-20 text-xl font-semibold tracking-tight", props.className)} {...props}>
      {props.children}
    </h4>
  );
}

export function TypographyH5(props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  return (
    <h5 className={cn("scroll-m-20 text-lg font-medium tracking-tight", props.className)} {...props}>
      {props.children}
    </h5>
  );
}