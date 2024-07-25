import { Skeleton } from '@/components/ui/skeleton';

export default async function ViewCounterFallback() {
  return (
    <Skeleton className="h-6 w-[9ch]"/>
  );
}