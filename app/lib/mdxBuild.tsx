import { bundleMDX } from 'mdx-bundler';

export default async function MdxBuild(file: string, cwd: string) {
  const result = await bundleMDX({
    file: file,
    cwd: cwd,
  });

  return result;
}