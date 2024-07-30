import { notFound, redirect } from 'next/navigation';

import { getListOfAllTags } from '@/lib/contentQueries';

export default function Page({ params }: { params: { tag: string } }) {
  const { tag } = params;
  
  if (!getListOfAllTags().includes(tag)) {
    notFound();
  }

  redirect(`/tags/${tag}/page/1`);
}

export async function generateStaticParams() {
  const tags = getListOfAllTags();

  return tags.map((tag) => (
    { tag: tag }
  ));
}