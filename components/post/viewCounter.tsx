import { getViewsCount } from '@/lib/dataBaseQueries';

export default async function ViewCounter({ slug }: { slug: string }) {
  let allViews = await getViewsCount();
  const viewsForSlug = allViews && allViews.find((view) => view.slug === slug);
  const number = new Number(viewsForSlug?.count || 0);

  return (
    <span>
      {`${number.toLocaleString()} views`}
    </span>
  );
}