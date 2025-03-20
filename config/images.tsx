import { StaticImageData } from 'next/image';

import coverHate from '@/public/images/why-do-people-just-hate-mathematics/cover-cropped.jpeg';
import coverArt from '@/public/images/how-to-practice-mathematics-as-an-art/cover.jpeg';
import coverLeaks from '@/public/images/ib-leaks/cover.jpeg';
import coverProc from '@/public/images/procrastination/cover.jpeg';
import coverResults from '@/public/images/results-of-my-lifes-last-two-years-are-out/cover.jpeg';
import coverLonely from '@/public/images/why-mathematics-is-lonely/cover.jpeg';
import coverStartpage from '@/public/images/purple-startpage/cover.png';
import coverSlang from '@/public/images/turkish-slang-dictionary/cover.png';
import coverCatter from '@/public/images/catter-blog/cover.png';
import coverClone from '@/public/images/creating-a-clone-of-yourself/cover.jpeg';
import coverSkip from '@/public/images/skip-list/cover.jpeg';

import coverSquareStartpage from '@/public/images/purple-startpage/square.jpeg';
import coverSquareSlang from '@/public/images/turkish-slang-dictionary/square.png';
import coverSquareCatter from '@/public/images/catter-blog/square.png';
import coverSquareSkip from '@/public/images/skip-list/cover-square.jpg';

export const images: { [key: string]: StaticImageData } = {
  'why-do-people-just-hate-mathematics': coverHate,
  'how-to-practice-mathematics-as-an-art': coverArt,
  'ib-leaks': coverLeaks,
  'procrastination': coverProc,
  'results-of-my-lifes-last-two-years-are-out': coverResults,
  'why-mathematics-is-lonely': coverLonely,
  'purple-startpage': coverStartpage,
  'turkish-slang-dictionary': coverSlang,
  'catter-blog': coverCatter,
  'creating-a-clone-of-yourself': coverClone,
  'skip-list': coverSkip,
};

export const squareImages: { [key: string]: StaticImageData } = {
  'purple-startpage': coverSquareStartpage,
  'turkish-slang-dictionary': coverSquareSlang,
  'catter-blog': coverSquareCatter,
  'skip-list': coverSquareSkip,
};