import { bundleMDX } from 'mdx-bundler';

export default async function MdxBuild(slug: string, cwd: string) {
  const file = cwd + `${slug}.mdx`;
  
  const result = await bundleMDX({
    file: file,
    cwd: cwd,
  });

  return result;
}