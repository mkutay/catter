import { redirect } from 'next/navigation';

import { getListOfAllTags } from '@/lib/dbContentQueries';

export const dynamic = 'force-static';
// export const dynamicParams = false;

export default async function Page(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params;
  const { tag } = params;

  redirect(`/tags/${tag}/page/1`);
}

export async function generateStaticParams() {
  const tags = await getListOfAllTags();
  if (tags.isErr()) throw new Error(tags.error.message);

  return tags.value.map((tag) => (
    { tag }
  ));
}