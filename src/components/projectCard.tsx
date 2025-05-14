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
import { getPlaceholder } from "@/lib/dbContentQueries";
import { Post } from '@/config/types';

export default async function ProjectCard({ props }: { props: Post }) {
  const placeholder = await getPlaceholder(props.meta.coverSquare || '/images/favicon.png');

  return (
    <Card>
      <div className="m-2">
        {props.meta.coverSquare && <Image
          alt={`Project ${props.meta.title}'s cover square image`}
          src={`/api${props.meta.coverSquare}`}
          className="rounded-xl shadow-md"
          quality={50}
          width={placeholder.metadata.width}
          height={placeholder.metadata.height}
          priority={true}
          placeholder={placeholder.base64 as `data:image/${string}`}
        />}
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