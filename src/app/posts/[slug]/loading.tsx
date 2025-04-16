import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  const skeletons = Array.from({ length: 6 }, (_, i) => (
    <Skeleton key={i} className="h-6 w-full" />
  ));
  skeletons.push(
    <Skeleton key={skeletons.length + 1} className="h-6 w-2/3" />
  )

  return (
    <div className="flex flex-col gap-2">
      {skeletons}
    </div>
  );
}