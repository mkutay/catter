import { Suspense } from 'react';
import Link from 'next/link';


import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getListOfAllTags } from '@/lib/contentQueries';
import { getBlogViews } from '@/lib/dataBaseQueries';
import { siteConfig } from '@/config/site';

export default function TagsButtonGrid() {
  const tags = getListOfAllTags();

  return (
    <div>
      <div className="gap-4 grid grid-flow-row sm:grid-cols-3 grid-cols-2 items-center not-prose">
        {tags.map((tag) => (
          <Button key={tag} variant="outline" size="lg" asChild className="text-lg font-bold tracking-tight">
            <Link href={`/tags/${tag}/page/1`}>
              {turnTagString(tag)}
            </Link>
          </Button>
        ))}
      </div>
      <div className="mt-8">
        <Suspense fallback={<Skeleton className="h-8 w-[10ch]"/>}>
          <TotalBlogViews/>
        </Suspense>
      </div>
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

export async function TotalBlogViews() {
  const views = await getBlogViews();

  return (
    <div className="flex justify-center items-center text-secondary font-bold tracking-tight text-lg">
      {`${views} total views`}
    </div>
  );
}