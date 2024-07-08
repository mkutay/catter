import getPosts, { getPostsLength } from "@/app/lib/getPosts";
import { notFound, redirect } from "next/navigation";

export default function Page({ params }: { params: { tag: string } }) {
  const tag = params.tag;
  const posts = getPosts(0, 100000);
  let postsThatHaveTag: {
    slug: string,
    meta: { [key: string]: any }
  }[] = [];

  posts.forEach((post) => {
    if (post.meta.tags.includes(tag)) {
      postsThatHaveTag.push(post);
    }
  });

  if (postsThatHaveTag.length == 0) {
    notFound();
  }

  redirect(`/tags/${tag}/page/1`);
}

export async function generateStaticParams() {
  const posts = getPosts(0, 100000);
  let ret: { tag: string }[] = [];
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.meta.tags.forEach((tag: string) => {
      tags.add(tag);
    });
  });

  const arrayTags: string[] = Array.from(tags);

  arrayTags.forEach((tag) => {
    ret.push({ tag: tag });
  })

  return ret;
}