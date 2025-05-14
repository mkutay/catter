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
import { PostMeta } from '@/config/types';
import { squareImages } from "@/config/images";

export default function ProjectCard({
  props
}: {
  props: {
    slug: string,
    meta: PostMeta,
    content: string,
  }
}) {
  const image = squareImages[props.slug] ? squareImages[props.slug] : props.meta.coverSquare;

  return (
    <Card>
      <div className="m-2">
        <Image
          alt={`Project ${props.meta.title}'s cover square image`}
          src={image}
          className="rounded-xl shadow-md"
          quality={50}
          placeholder="blur"
        />
      </div>
      <CardHeader>
        <CardTitle>{props.meta.title}</CardTitle>
        <CardDescription>{props.meta.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <MDXRemote source={props.meta.excerpt} options={options} components={components}/>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline">
          <Link href={`/posts/${props.slug}`} className="text-foreground">
            {`Read More: ${props.meta.shortened.toLowerCase().split(' ').map(function(word) { return word[0].toUpperCase() + word.slice(1); }).join(' ')}`}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}