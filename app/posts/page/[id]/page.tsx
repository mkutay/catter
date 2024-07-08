import getPosts, { getPostsLength } from "@/app/lib/getPosts";
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import TagsButtonGrid from "@/components/tagsButtonGrid";
import PaginationArrows from "@/components/paginationArrows";

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  }
};

export function generateMetadata({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const postsLength = getPostsLength();

  return {
    title: `Posts and Tags On the Blog | Page ${id}`,
    description: `List of all the latest posts and tags on ${siteConfig.name}, currently on page ${id} out of ${Math.ceil(postsLength / siteConfig.postNumPerPage)}.`,
    openGraph: {
      title: `Posts | Page ${id}`,
      description: `List of all the latest posts on ${siteConfig.name}, currently on page ${id} out of ${Math.ceil(postsLength / siteConfig.postNumPerPage)}.`,
      url: `${siteConfig.url}/posts/page/${id}`,
    },
  };
}

export default function Page({ params }: { params: { id: string } }) {
  if (/^-?\d+$/.test(params.id) == false) {
    notFound();
  }
  
  const id = Number(params.id);

  const postsLength = getPostsLength();

  if (siteConfig.postNumPerPage * (id - 1) >= postsLength || id <= 0) {
    notFound();
  }

  const posts: {
    slug: string,
    meta: { [key: string]: any }
  }[] = getPosts(siteConfig.postNumPerPage * (id - 1), siteConfig.postNumPerPage * id);

  return (
    <section className="max-w-prose mx-auto my-0 py-8 prose px-4 prose-h1:my-0">
      <h1>
        List of All Posts and Tags
      </h1>
      <hr/>
      <div>
        {posts.map((post, index) => (
          <div key={post.slug} className="prose-h2:mt-0 prose-h2:mb-4">
            <h2 className="prose-a:text-[#4c4f69] dark:prose-a:text-[#cdd6f4]">
              <Link
                href={'/posts/' + post.slug}
                passHref
                key={post.slug}
              >
                {post.meta.title}
              </Link>
            </h2>
            <em className="text-[#6c6f85] dark:text-[#a6adc8] not-prose my-4">
              {post.meta.description}
            </em>
            <div className="prose-p:my-4 prose-p:py-0">
              <MDXRemote source={post.meta.excerpt} options={options}/>
            </div>
            {index !== posts.length - 1 && <hr/>}
          </div>
        ))}
      </div>
      <hr/>
      <PaginationArrows totalPages={Math.ceil(postsLength / siteConfig.postNumPerPage)} currentId={id} href="/posts/page"/>
      <hr/>
      <TagsButtonGrid/>
    </section>
  )
}

export async function generateStaticParams() {
  const posts = getPosts(0, 100000);

  let ret: {id: string}[] = [];
  for (let i = 1; i <= Math.ceil(posts.length / siteConfig.postNumPerPage); i++) {
    ret.push({ id: i.toString() });
  }

  return ret;
}