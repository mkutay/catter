import { cn } from "@/lib/utils";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export function TypographyParagraph(props: DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>) {
  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6 font-normal", props.className)} {...props}>
      {props.children}
    </p>
  );
}

export function TypographyLead({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <p className={cn("text-xl text-muted-foreground", className)}>
      {children}
    </p>
  )
}

export function TypographyLarge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("text-lg font-semibold", className)}>
    {children}
  </div>
}

export function TypographySmall({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <small className={cn("text-sm font-medium leading-none", className)}>{children}</small>
  )
}

export function TypographyMuted({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
  )
}
