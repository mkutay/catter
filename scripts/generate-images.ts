import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { siteConfig } from './../src/config/site.ts';
import { type postMetaType } from './../src/config/types.ts';

function getPostFiles() {
  const postFiles = fs.readdirSync(path.join(process.cwd(), 'content/posts'), 'utf-8');
  return postFiles;
}

function getProps(pathTo: string, slug: string) {
  let markdownFile;

  try {
    markdownFile = fs.readFileSync(path.join(process.cwd(), path.join(pathTo, slug + '.mdx')), 'utf-8');
  } catch(error) {
    throw new Error(`File not found: ${path.join(process.cwd(), path.join(pathTo, slug + '.mdx'))}`);
  }

  const { data: frontMatter, content } = matter(markdownFile);

  return {
    slug: slug,
    meta: frontMatter as postMetaType,
    content: content,
  };
}

function getPosts() {
  const postFiles = getPostFiles();

  const posts: {
    slug: string,
    content: string,
    meta: postMetaType,
  }[] = [];
  
  postFiles.forEach((filename) => {
    const slug = filename.replace('.mdx', '');
    const props = getProps('content/posts', slug);

    posts.push(props);
  });

  return posts;
}

function uppercaseFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const posts = getPosts();

type imageType = {
  importPath: string,
  importName: string,
  slug: string,
};

let coverImages: imageType[] = [];
let coverSquareImages: imageType[] = [];
let followNextImages: imageType[] = [];

posts.forEach((post) => {
  if (post.meta.coverSquare) {
    const imagePath = path.join(process.cwd(), 'public', post.meta.coverSquare);
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image not found: ${imagePath}`);
    }

    coverSquareImages.push({
      importPath: imagePath,
      importName: "coverSquare" + uppercaseFirstLetter(post.meta.shortened),
      slug: post.slug,
    });
  }

  if (post.meta.cover) {
    const imagePath = path.join(process.cwd(), 'public', post.meta.cover);
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image not found: ${imagePath}`);
    }

    coverImages.push({
      importPath: imagePath,
      importName: "cover" + uppercaseFirstLetter(post.meta.shortened),
      slug: post.slug,
    });
  }
});

siteConfig.followNext.forEach((website) => {
  const imagePath = path.join(process.cwd(), 'public', website.imagePath);
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image not found: ${imagePath}`);
  }

  followNextImages.push({
    importPath: imagePath,
    importName: "followNext" + uppercaseFirstLetter(website.shortened),
    slug: website.shortened,
  });
});

// Function to generate the images.tsx content:
function generateImagesCode(): string {
  let imports = [];
  let imagesObject = [];
  let squareImagesObject = [];
  let followNextImagesObject = [];

  imports.push(`import { StaticImageData } from 'next/image';`);
  imports.push('');

  // Generate imports for cover images
  coverImages.forEach((image) => {
    const relativePath = image.importPath.split('public')[1].replace(/\\/g, '/');
    imports.push(`import ${image.importName} from '@/public${relativePath}';`);
  });
  
  // Generate imports for cover square images
  coverSquareImages.forEach((image) => {
    const relativePath = image.importPath.split('public')[1].replace(/\\/g, '/');
    imports.push(`import ${image.importName} from '@/public${relativePath}';`);
  });

  // Generate imports for follow next images
  followNextImages.forEach((image) => {
    const relativePath = image.importPath.split('public')[1].replace(/\\/g, '/');
    imports.push(`import ${image.importName} from '@/public${relativePath}';`);
  });

  imports.push('');

  // Generate the images object
  imagesObject.push(`export const images: { [key: string]: StaticImageData } = {`);
  coverImages.forEach((image) => {
    imagesObject.push(`  '${image.slug}': ${image.importName},`);
  });
  imagesObject.push(`};`);
  imagesObject.push('');

  // Generate the squareImages object
  squareImagesObject.push(`export const squareImages: { [key: string]: StaticImageData } = {`);
  coverSquareImages.forEach((image) => {
    squareImagesObject.push(`  '${image.slug}': ${image.importName},`);
  });
  squareImagesObject.push(`};`);
  squareImagesObject.push('');

  // Generate the followNextImages object
  followNextImagesObject.push(`export const followNextImages: { [key: string]: StaticImageData } = {`);
  followNextImages.forEach((image) => {
    followNextImagesObject.push(`  '${image.slug}': ${image.importName},`);
  });
  followNextImagesObject.push(`}`);

  return [
    ...imports,
    ...imagesObject,
    ...squareImagesObject,
    ...followNextImagesObject
  ].join('\n');
}

// Write to file
const imagesFilePath = path.join(process.cwd(), 'src', 'config', 'images.tsx');
fs.writeFileSync(imagesFilePath, generateImagesCode());

console.log(`Generated images.tsx at ${imagesFilePath}`);