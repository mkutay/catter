import Link from "next/link";
import getPosts from "@/app/lib/getPosts";

export default function TagsButtonGrid() {
  const posts = getPosts(0, 100000);
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.meta.tags.forEach((tag: string) => {
      tags.add(tag);
    });
  });

  const arrayTags: string[] = Array.from(tags);

  return (
    <div className="gap-4 grid grid-flow-row sm:grid-cols-3 grid-cols-2 items-center">
      {arrayTags.map((tag) => (
        <Link key={tag} href={`/tags/${tag}`} className="border rounded-2xl py-2 px-4 text-center border-[#bcc0cc] dark:border-[#45475a] bg-[#e6e9ef] dark:bg-[#181825]">
          <div className="tracking-tight text-lg font-bold">
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </div>
        </Link>
      ))}
    </div>
  );
}