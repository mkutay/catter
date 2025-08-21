import { MDXRemote } from "next-mdx-remote-client/rsc";
import Link from 'next/link';
import Image from 'next/image';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { components, options } from '@/config/mdxRemoteSettings';
import { getPlaceholder } from "@/lib/images";
import { Post } from '@/config/types';
import { ArrowRight } from "lucide-react";

export default async function ProjectCard({ props, className }: { props: Post, className?: string }) {
  const coverImage = props.coverSquare || '/images/favicon.png';
  const coverUrl = coverImage[0] === '/' ? coverImage : `/${coverImage}`;
  const placeholder = await getPlaceholder(coverImage);

  const formattedTitle = props.shortened
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'Learn More';

  return (
    <Card className={className}>
      <div className="m-2">
        {coverUrl && <Link href={`/posts/${props.slug}`}>
          <Image
            alt={`Project ${props.title}'s cover square image`}
            src={`/api${coverUrl}`}
            className="rounded-xl shadow-md"
            quality={50}
            width={placeholder.metadata.width}
            height={placeholder.metadata.height}
            priority={true}
            placeholder={placeholder.base64 as `data:image/${string}`}
          />
        </Link>}
      </div>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription className="line-clamp-2">{props.description}</CardDescription>
      </CardHeader>
      <CardContent className="[&_p]:line-clamp-4">
        <MDXRemote source={props.excerpt} options={options} components={components} />
      </CardContent>
      <CardFooter>
        <Button
          asChild
          variant="outline"
          className="w-full justify-between group/btn hover:bg-primary/5"
        >
          <Link href={`/posts/${props.slug}`} className="relative z-10">
            <span className="font-medium">{formattedTitle}</span>
            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}