import { Skeleton } from '@/components/ui/skeleton';
import { getViewCount } from '@/lib/dataBaseQueries';

export default async function ViewCounter({ slug }: { slug: string }) {
  const viewCount = await getViewCount(slug);
  const number = viewCount.length === 0 ? 0 : Number(viewCount[0].count);

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