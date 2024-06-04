import MdxBuild from "@/app/lib/mdxBuild";
import { getMDXComponent } from 'mdx-bundler/client';
import path from 'path';
import { getFormatter } from 'next-intl/server';
import type { Metadata } from "next";
import { describe } from "node:test";
// import * as React from 'react';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const cwd = process.cwd();
  const { frontmatter } = await MdxBuild(slug, path.join(cwd, `app/posts/posts/`));

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

// export default async function Page() {
export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const cwd = process.cwd();
  const { code, frontmatter } = await MdxBuild(slug, path.join(cwd, `app/posts/posts/`));

  const format = await getFormatter();
  const date = new Date(frontmatter.date);

  const formattedDate = format.dateTime(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // const Component = React.useMemo(() => getMDXComponent(code), [code]);
  const Component = getMDXComponent(code);

  return (
    <div className="max-w-prose mx-auto my-0 py-8">
      <header>
        <h1 className="font-bold text-xl pb-1.5">
          {frontmatter.title}
        </h1>
        <p className="py-1.5 font-medium">
          {formattedDate}
        </p>
        <p className="py-1.5 italic text-right">
          {frontmatter.description}
        </p>
      </header>
      <main className="prose">
        <Component/>
      </main>
    </div>
  );
}