import { notFound, redirect } from 'next/navigation';

import { getListOfAllTags } from '@/lib/postQueries';

export default function Page({ params }: { params: { tag: string } }) {
  const { tag } = params;
  
  if (getListOfAllTags().includes(tag) == false) {
    notFound();
  }

  redirect(`/tags/${tag}/page/1`);
}

export async function generateStaticParams() {
  let ret: { tag: string }[] = [];
  const tags = getListOfAllTags();

  tags.forEach((tag) => {
    ret.push({ tag: tag });
  })

  return ret;
}