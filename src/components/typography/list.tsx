import { cn } from '@/lib/utils';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export function TypographyUList(props: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>) {
  return (
    <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", props.className)} {...props}>
      {props.children}
    </ul>
  );
}

export function TypographyOList(props: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLOListElement>) {
  return (
    <ol className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", props.className)} {...props}>
      {props.children}
    </ol>
  );
}