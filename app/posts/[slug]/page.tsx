import MdxBuild from "@/app/lib/mdxBuild";
import { getMDXComponent } from 'mdx-bundler/client';
// import * as React from 'react';

// export default async function Page() {
export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const { code, frontmatter } = await MdxBuild(slug, process.cwd() + `/content/posts/`);

  // const Component = React.useMemo(() => getMDXComponent(code), [code]);
  const Component = getMDXComponent(code);

  return (
    <div className="max-w-prose mx-auto my-0 py-8">
      <header>
        <h1 className="font-semibold text-4xl">{frontmatter.title}</h1>
        <p>{frontmatter.description}</p>
      </header>
      <main>
        <Component/>
      </main>
    </div>
  );
}