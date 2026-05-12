import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getListOfAllTags } from "@/lib/dbContentQueries";
import { turnTagString } from "@/lib/utils";

export default async function TagsButtonGrid() {
  const tags = await getListOfAllTags();
  if (tags.isErr()) throw new Error(tags.error.message);

  return (
    <div className="flex flex-col gap-6">
      <div className="gap-2 grid grid-flow-row sm:grid-cols-3 grid-cols-2 items-center">
        {tags.value.map((tag) => (
          <Button key={tag} variant="outline" asChild className="uppercase">
            <Link href={`/tags/${tag}`}>{turnTagString(tag)}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
