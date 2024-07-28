import Link from 'next/link';

import { getListOfAllTags } from '@/lib/postQueries';
import { siteConfig } from '@/config/site';
import { Button } from './ui/button';

export default function TagsButtonGrid() {
  const tags = getListOfAllTags();

  return (
    <div className="gap-4 grid grid-flow-row sm:grid-cols-3 grid-cols-2 items-center not-prose">
      {tags.map((tag) => (
        <Button key={tag} variant="default" size="lg" asChild className="text-lg font-bold tracking-tight">
          <Link href={`/tags/${tag}/page/1`} className="text-text">
            {turnTagString(tag)}
          </Link>
        </Button>
      ))}
    </div>
  );
}

export function turnTagString(tag: string) {
  if (siteConfig.tagsThatShouldBeCapital.includes(tag)) {
    return tag.toUpperCase();
  }
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}