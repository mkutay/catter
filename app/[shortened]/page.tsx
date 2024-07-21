import { getPostFiles, getProps } from '@/lib/postQueries';
import { notFound, redirect } from 'next/navigation';

export default function Page({ params }: { params: { shortened: string } }) {
  const { shortened } = params;
  const postFiles = getPostFiles();
  
  postFiles.forEach((postFile) => {
    const props = getProps('content/posts', postFile.replace('.mdx', ''));
    if (props.meta.shortened === shortened) {
      redirect(`/posts/${postFile.replace('.mdx', '')}`);
    }
  });

  notFound();
}

export async function generateStaticParams() {
  const postFiles = getPostFiles();

  return postFiles.map(filename => ({
    shortened: getProps('content/posts', filename.replace('.mdx', '')).meta.shortened ?? '/',
  }));
}