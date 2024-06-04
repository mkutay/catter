import path from 'path';
import type { Metadata } from "next";
import { MDXRemote, compileMDX } from 'next-mdx-remote/rsc';
import { promises as fs } from 'fs';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;

  const source = await fs.readFile(path.join(process.cwd(), `app/pages/pages/${slug}.mdx`), 'utf-8');

  const { content, frontmatter } = await compileMDX<{ title: string, description: string, date: string }>({
    source: String(source),
    options: { parseFrontmatter: true },
  });

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: 'https://mkutay.dev/posts/' + slug,
    },
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const source = await fs.readFile(path.join(process.cwd(), `app/pages/pages/${slug}.mdx`), 'utf-8');

  const { content, frontmatter } = await compileMDX<{ title: string, description: string, date: string }>({
    source: String(source),
    options: { parseFrontmatter: true },
  });

  return (
    <div className="max-w-prose mx-auto my-0 py-8">
      <header>
        <h1 className="font-bold text-xl pb-4">
          {frontmatter.title}
        </h1>
        <p className="py-1.5 text-right italic">
          {frontmatter.description}
        </p>
      </header>
      <main className="prose">
        {content}
      </main>
    </div>
  );
}