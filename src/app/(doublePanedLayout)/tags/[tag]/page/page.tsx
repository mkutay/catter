import { redirect } from 'next/navigation';

import { getListOfAllTags } from '@/lib/contentQueries';

export const dynamic = 'force-static';
export const dynamicParams = false;

export default async function Page(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params;
  const { tag } = params;

  redirect(`/tags/${tag}/page/1`);
}

export async function generateStaticParams() {
  const tags = getListOfAllTags();

  return tags.map((tag) => (
    { tag: tag }
  ));
}