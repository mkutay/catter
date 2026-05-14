import path from "node:path";
import fs from "fs";
import matter from "gray-matter";
import { notFound } from "next/navigation";

/**
 * Fetches the content and metadata for the 'About' page from the filesystem.
 *
 * Parses the MDX file located at `src/app/about/about.mdx`.
 */
export function getAboutProps() {
  let markdownFile: string;
  try {
    markdownFile = fs.readFileSync(
      path.join(process.cwd(), path.join("src/app/about/about.mdx")),
      "utf-8",
    );
  } catch (error) {
    console.error(error);
    notFound();
  }

  const { data: frontMatter, content } = matter(markdownFile);

  const postData = {
    meta: frontMatter as {
      title: string;
      description: string;
      date: string;
    },
    content: content,
  };

  return postData;
}
