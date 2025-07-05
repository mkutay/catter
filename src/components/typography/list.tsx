import { DetailedHTMLProps, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function TypographyUList(props: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>) {
  return (
    <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-1", props.className)} {...props}>
      {props.children}
    </ul>
  );
}

export function TypographyOList(props: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLOListElement>) {
  return (
    <ol className={cn("my-6 ml-6 list-decimal [&>li]:mt-1 [&>li]:pl-0.5", props.className)} {...props}>
      {props.children}
    </ol>
  );
}