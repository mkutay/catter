import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { getListOfAllTags } from '@/lib/contentQueries';
import { siteConfig } from '@/config/site';

export default function TagsButtonGrid() {
  const tags = getListOfAllTags();

  return (
    <div className="gap-4 grid grid-flow-row sm:grid-cols-3 grid-cols-2 items-center not-prose">
      {tags.map((tag) => (
        <Button key={tag} variant="outline" size="lg" asChild className="text-lg font-bold tracking-tight">
          <Link href={`/tags/${tag}/page/1`}>
            {turnTagString(tag)}
          </Link>
        </Button>
      ))}
    </div>
  );
}

export function turnTagString(tag: string) {
  tag = tag.replace('-', ' ');

  if (siteConfig.tagsThatShouldBeCapital.includes(tag)) {
    return tag.toUpperCase();
  }

  return tag
    .toLowerCase()
    .split(' ')
    .map(function(word) {
      return word[0].toUpperCase() + word.slice(1);
    })
    .join(' ');
}