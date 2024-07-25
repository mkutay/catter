import { getPostFiles, getProps } from '@/lib/postQueries';
import { getProjectFiles } from '@/lib/projectQueries';
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

  const projectFiles = getProjectFiles();

  projectFiles.forEach((postFile) => {
    const props = getProps('content/projects', postFile.replace('.mdx', ''));
    if (props.meta.shortened === shortened) {
      redirect(`/projects/${postFile.replace('.mdx', '')}`);
    }
  });

  notFound();
}

export async function generateStaticParams() {
  const postFiles = getPostFiles();
  const ret: { shortened: string }[] = [];

  postFiles.forEach((filename) => {
    ret.push({ shortened: getProps('content/posts', filename.replace('.mdx', '')).meta.shortened ?? '/' });
  });

  const projectFiles = getProjectFiles();

  projectFiles.forEach((filename) => {
    ret.push({ shortened: getProps('content/projects', filename.replace('.mdx', '')).meta.shortened ?? '/' });
  });

  return ret;
}