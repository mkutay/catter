import { MDXRemote } from 'next-mdx-remote/rsc';
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
import { components, options } from '@/lib/mdxRemoteSettings';
import { postMeta } from '@/config/site';

export default function ProjectCard({
  props
}: {
  props: {
    slug: string,
    meta: postMeta,
    content: string,
  }
}) {
  return (
    <Card className="not-prose">
      <div className="m-2">
        <Image
          alt={`Project ${props.meta.title}'s cover square image`}
          src={props.meta.coverSquare}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          className="rounded-xl shadow-md"
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
        <Button asChild>
          <Link href={`/posts/${props.slug}`} className="text-foreground">
            {`Read More: ${props.meta.shortened.toLowerCase().split(' ').map(function(word) { return word[0].toUpperCase() + word.slice(1); }).join(' ')}`}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}