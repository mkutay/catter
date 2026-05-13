import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { components, options } from "@/config/mdxRemoteSettings";
import type { Post } from "@/config/types";
import { getPlaceholder } from "@/lib/images";
import { postShortened } from "@/lib/utils";

export async function ProjectCard({
  props,
  className,
}: {
  props: Post;
  className?: string;
}) {
  const coverImage = props.coverSquare || "/images/favicon.png";
  const coverUrl = coverImage[0] === "/" ? coverImage : `/${coverImage}`;
  const placeholder = await getPlaceholder(coverImage);

  return (
    <Card className={className}>
      <div className="m-2">
        {coverUrl && (
          <Link href={`/posts/${props.slug}`}>
            <Image
              alt={`Project ${props.title}'s cover square image`}
              src={`/api${coverUrl}`}
              className="rounded-xl shadow-md"
              quality={75}
              width={placeholder.metadata.width}
              height={placeholder.metadata.height}
              priority={true}
              placeholder={placeholder.base64 as `data:image/${string}`}
            />
          </Link>
        )}
      </div>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <div className="[&_p]:line-clamp-2 text-sm text-muted-foreground font-sans font-medium">
          <MDXRemote source={props.description} options={options} />
        </div>
      </CardHeader>
      <CardContent className="[&_p]:line-clamp-4">
        <MDXRemote
          source={props.excerpt}
          options={options}
          components={components}
        />
      </CardContent>
      <CardFooter>
        <Button
          asChild
          variant="outline"
          className="w-full justify-between uppercase"
        >
          <Link href={`/posts/${props.slug}`}>
            Read More: {postShortened(props.shortened)}
            <ArrowRight className="size-6" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
