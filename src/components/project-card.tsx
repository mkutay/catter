import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Post } from "@/config/types";
import { getImagePlaceholder } from "@/lib/images";
import { RenderPost } from "@/lib/rendering";
import { humanReadable } from "@/lib/utils";

export async function ProjectCard({
  props,
  className,
}: {
  props: Post;
  className?: string;
}) {
  const coverImage = props.coverSquare ?? "/images/favicon.png";
  const { metadata, base64, url } = await getImagePlaceholder(coverImage);

  return (
    <Card className={className}>
      <div className="m-2">
        <Link href={`/posts/${props.slug}`}>
          <Image
            alt={`Project ${props.title}'s cover square image`}
            src={url}
            className="rounded-xl shadow-md"
            quality={75}
            width={metadata.width}
            height={metadata.height}
            priority={true}
            placeholder={base64}
          />
        </Link>
      </div>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <div className="[&_p]:line-clamp-2 text-sm text-muted-foreground font-sans font-medium">
          <RenderPost source={props.description} />
        </div>
      </CardHeader>
      <CardContent className="[&_p]:line-clamp-4">
        <RenderPost source={props.excerpt} />
      </CardContent>
      <CardFooter>
        <Button
          asChild
          variant="outline"
          className="w-full justify-between uppercase"
        >
          <Link href={`/posts/${props.slug}`}>
            Read More: {humanReadable(props.shortened)}
            <ArrowRight className="size-6" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
