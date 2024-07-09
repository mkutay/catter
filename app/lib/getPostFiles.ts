import fs from 'fs';
import path from 'path';

export function getPostFiles() {
  const postFiles = fs.readdirSync(path.join(process.cwd(), 'content/posts'), 'utf-8');
  return postFiles;
}