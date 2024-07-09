import Link from "next/link";
import { getListOfAllTags } from "@/app/lib/getListOfAllTags";

export default function TagsButtonGrid() {
  const tags = getListOfAllTags();

  return (
    <div className="gap-4 grid grid-flow-row sm:grid-cols-3 grid-cols-2 items-center">
      {tags.map((tag) => (
        <Link key={tag} href={`/tags/${tag}/page/1`} className="border rounded-2xl py-2 px-4 text-center border-[#bcc0cc] dark:border-[#45475a] bg-[#e6e9ef] dark:bg-[#181825]">
          <div className="tracking-tight text-lg font-bold">
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </div>
        </Link>
      ))}
    </div>
  );
}