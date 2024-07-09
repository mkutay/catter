import getPosts from "@/app/lib/getPosts";

export function getListOfAllTags() {
  const posts = getPosts({  });
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.meta.tags.forEach((tag: string) => {
      tags.add(tag);
    });
  });

  return Array.from(tags);
}