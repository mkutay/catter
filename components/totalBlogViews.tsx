import { getBlogViews } from '@/lib/dataBaseQueries';
import { unstable_cache } from 'next/cache';

const getCachedBlogViews = unstable_cache(
  async () => getBlogViews(),
  ['nextjs-blog-total-views'],
  {
    revalidate: 900, // 15 minutes
  },
);

export async function TotalBlogViews() {
  const views = await getCachedBlogViews();

  return (
    <div className="flex justify-center items-center">
      {`${views} views`}
    </div>
  );
}