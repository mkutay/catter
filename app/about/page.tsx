import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import fs from 'fs';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  }
};

export function generateMetadata() {
  const slug = "about";
  const blog = getPage();

  return {
    title: blog.meta.title,
    description: blog.meta.description,
    openGraph: {
      title: blog.meta.title,
      description: blog.meta.description,
      url: 'https://www.mkutay.dev/posts/' + slug,
    },
  };
}

export default async function Page() {
  const props = getPage();

  return (
    <div className="max-w-prose mx-auto my-0 py-8 prose px-4 sm:px-8">
      <h1 className="my-0">
        {props.meta.title}
      </h1>
      <hr/>
      {props.meta.addDescription && (<p className="mb-4 text-right italic">
        {props.meta.description}
      </p>)}
      <main className="prose-p:mb-0">
        <MDXRemote source={props.content} options={options}/>
      </main>
    </div>
  );
}

function getPage() {
  const markdownFile = fs.readFileSync(path.join(process.cwd(), `app/about/about.mdx`), 'utf-8');
  const { data: frontMatter, content } = matter(markdownFile);

  return {
    meta: frontMatter,
    slug: "about",
    content: content,
  };
}