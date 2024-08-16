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
};