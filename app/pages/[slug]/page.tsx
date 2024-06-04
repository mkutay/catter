import MdxBuild from "@/app/lib/mdxBuild";
import { getMDXComponent } from 'mdx-bundler/client';
import path from 'path';
// import * as React from 'react';

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const cwd = process.cwd();
  const { code, frontmatter } = await MdxBuild(slug, path.join(cwd, `app/pages/pages/`));

  // const Component = React.useMemo(() => getMDXComponent(code), [code]);
  const Component = getMDXComponent(code);

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
        <Component/>
      </main>
    </div>
  );
}