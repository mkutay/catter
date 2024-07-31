import { unstable_cache } from 'next/cache';

import { Skeleton } from '@/components/ui/skeleton';
import { getViewsCount } from '@/lib/dataBaseQueries';

const getCachedViewsCount = unstable_cache(
  async () => getViewsCount(),
  ['nextjs-blog-views-count'],
  {
    revalidate: 120,
  },
);

export default async function ViewCounter({ slug }: { slug: string }) {
  let allViews = await getCachedViewsCount();
  const viewsForSlug = allViews && allViews.find((view) => view.slug === slug);
  const number = new Number(viewsForSlug?.count || 0);

  return (
    <span>
      {`${number.toLocaleString()} views`}
    </span>
  );
}

export async function ViewCounterFallback() {
  return (
    <Skeleton className="h-6 w-[9ch]"/>
  );
}