import { ArrowRightIcon } from '@radix-ui/react-icons';
import { Skeleton } from '@/components/ui/skeleton';

export async function MostViewedPostsFallback({ postNum }: { postNum: number }) {
  const posts = [];
  for (let i = 0; i < postNum; i++) {
    posts.push(i);
  }

  return (
    <ul className="px-0">
      {posts.map((ind) => (
        <div key={ind} className="flex flex-row items-center group pl-0 hover:pl-2 transition-all px-0">
          <div className="pr-4 group-hover:pr-2 transition-all">
            <ArrowRightIcon stroke="currentColor" strokeWidth="1.7px"/>
          </div>
          <Skeleton className="h-6 w-full my-2"/>
        </div>
      ))}
    </ul>
  );
}