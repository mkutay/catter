import { notFound, redirect } from 'next/navigation';

import { getPostFiles, getProps } from '@/lib/postQueries';
import { getProjectFiles } from '@/lib/projectQueries';

export default function Page({ params }: { params: { shortened: string } }) {
  const { shortened } = params;
  const postFiles = getPostFiles();
  const projectFiles = getProjectFiles();
  
  postFiles.forEach((postFile) => {
    const props = getProps('content/posts', postFile.replace('.mdx', ''));
    if (props.meta.shortened === shortened) {
      redirect(`/posts/${postFile.replace('.mdx', '')}`);
    }
  });

  projectFiles.forEach((postFile) => {
    const props = getProps('content/projects', postFile.replace('.mdx', ''));
    if (props.meta.shortened === shortened) {
      redirect(`/projects/${postFile.replace('.mdx', '')}`);
    }
  });

  notFound();
}

export function generateStaticParams() {
  const postFiles = getPostFiles();
  const ret: { shortened: string }[] = [];
  const projectFiles = getProjectFiles();

  postFiles.forEach((filename) => {
    ret.push({ shortened: getProps('content/posts', filename.replace('.mdx', '')).meta.shortened ?? '/' });
  });

  projectFiles.forEach((filename) => {
    ret.push({ shortened: getProps('content/projects', filename.replace('.mdx', '')).meta.shortened ?? '/' });
  });

  return ret;
}