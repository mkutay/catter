import getPosts, { getPostsLength } from "@/app/lib/getPosts";
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { notFound } from "next/navigation";

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
    title: `Posts | Page ${id}`,
    description: `List of all posts for page ${id} out of ${Math.ceil(postsLength / 5)}`,
    openGraph: {
      title: `Posts | Page ${id}`,
      description: `List of all posts for page ${id} out of ${Math.ceil(postsLength / 5)}`,
      url: `https://www.mkutay.dev/posts/page/${id}`,
    },
  };
}

export default function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  const postsLength = getPostsLength();

  if (5 * (id - 1) >= postsLength || id <= 0) {
    notFound();
  }

  const posts: {
    slug: string,
    meta: { [key: string]: any }
  }[] = getPosts(5 * (id - 1), 5 * id);

  return (
    <section className="max-w-prose mx-auto my-0 py-8 prose px-4 sm:px-8">
      <h1>
        Posts
      </h1>
      <hr/>
      <div>
        {posts.map((post, index) => (
          <div key={post.slug}>
            <h2 className="prose-a:text-[#4c4f69] dark:prose-a:text-[#cdd6f4] mt-0 mb-4">
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
            <div className="prose-p:my-4">
              <MDXRemote source={post.meta.excerpt} options={options}/>
            </div>
            {index !== posts.length - 1 && <hr/>}
          </div>
        ))}
      </div>
      <hr/>
      <PaginationArrows totalPages={Math.ceil(postsLength / 5)} currentId={id}/>
    </section>
  )
}

function PaginationArrows({ totalPages, currentId }: { totalPages: number, currentId: number }) {
  const prevPage = currentId - 1 > 0;
  const nextPage = currentId + 1 <= totalPages;

  return (
    <div className="flex text-lg justify-between not-prose">
      {!prevPage ? (
        <div className="cursor-auto text-[#6c6f85] dark:text-[#a6adc8]">
          Previous
        </div>
      ) : (
        <Link
          href={`/posts/page/${currentId - 1}`}
          rel="prev"
          className="dark:text-[#cdd6f4] text-[#4c4f69] underline"
        >
          Previous
        </Link>
      )}
      <em className="dark:text-[#cdd6f4] text-[#4c4f69] place-self-center">
        {currentId} of {totalPages}
      </em>
      {!nextPage ? (
        <div className="cursor-auto text-[#6c6f85] dark:text-[#a6adc8]">
          Next
        </div>
      ) : (
        <Link
          href={`/posts/page/${currentId + 1}`}
          rel="next"
          className="dark:text-[#cdd6f4] text-[#4c4f69] underline"
        >
          Next
        </Link>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const posts = getPosts(0, 100000);

  let ret: {id: string}[] = [];
  for (let i = 1; i <= Math.ceil(posts.length / 5); i++) {
    ret.push({ id: i.toString() });
  }

  return ret;
}