import type { DetailedHTMLProps, HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function TypographyUList(
  props: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
) {
  return (
    <ul
      className={cn(
        "my-6 ml-6 list-disc space-y-2 **:[&_ul]:my-2 **:[&_ol]:my-2 **:[&_ul]:ml-8 **:[&_ol]:ml-8",
        props.className,
      )}
      {...props}
    >
      {props.children}
    </ul>
  );
}

export function TypographyOList(
  props: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLOListElement>,
) {
  return (
    <ol
      className={cn(
        "my-6 ml-6 list-decimal space-y-2 **:[&_ol]:my-2 **:[&_ul]:my-2 **:[&_ul]:ml-8 **:[&_ol]:ml-8",
        props.className,
      )}
      {...props}
    >
      {props.children}
    </ol>
  );
}
