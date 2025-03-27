import { StaticImageData } from 'next/image';

import coverArt from '@/public/images/how-to-practice-mathematics-as-an-art/cover.jpeg';
import coverSkip from '@/public/images/skip-list/cover.jpeg';
import coverResults from '@/public/images/results-of-my-lifes-last-two-years-are-out/cover.jpeg';
import coverCatter from '@/public/images/catter-blog/cover.png';
import coverClone from '@/public/images/creating-a-clone-of-yourself/cover.jpeg';
import coverProcrastination from '@/public/images/procrastination/cover.jpeg';
import coverHate from '@/public/images/why-do-people-just-hate-mathematics/cover-cropped.jpeg';
import coverStartpage from '@/public/images/purple-startpage/cover.png';
import coverLeaks from '@/public/images/ib-leaks/cover.jpeg';
import coverSlang from '@/public/images/turkish-slang-dictionary/cover.png';
import coverLonely from '@/public/images/why-mathematics-is-lonely/cover.jpeg';
import coverSquareArt from '@/public/images/how-to-practice-mathematics-as-an-art/cover-square.jpg';
import coverSquareSkip from '@/public/images/skip-list/cover-square.jpg';
import coverSquareResults from '@/public/images/results-of-my-lifes-last-two-years-are-out/cover-square.jpg';
import coverSquareCatter from '@/public/images/catter-blog/square.png';
import coverSquareClone from '@/public/images/creating-a-clone-of-yourself/cover-cropped.jpg';
import coverSquareProcrastination from '@/public/images/procrastination/cover-square.jpg';
import coverSquareHate from '@/public/images/why-do-people-just-hate-mathematics/cover-square.png';
import coverSquareStartpage from '@/public/images/purple-startpage/square.jpeg';
import coverSquareLeaks from '@/public/images/ib-leaks/cover-square.jpg';
import coverSquareSlang from '@/public/images/turkish-slang-dictionary/square.png';
import coverSquareLonely from '@/public/images/why-mathematics-is-lonely/cover-square.jpg';
import followNextMelikechan from '@/public/follow-next-images/melikechan.png';
import followNextComeau from '@/public/follow-next-images/comeau.png';
import followNextBendersky from '@/public/follow-next-images/bendersky.png';
import followNextSophie from '@/public/follow-next-images/localghost.png';

export const images: { [key: string]: StaticImageData } = {
  'how-to-practice-mathematics-as-an-art': coverArt,
  'skip-list': coverSkip,
  'results-of-my-lifes-last-two-years-are-out': coverResults,
  'catter-blog': coverCatter,
  'creating-a-clone-of-yourself': coverClone,
  'procrastination': coverProcrastination,
  'why-do-people-just-hate-mathematics': coverHate,
  'purple-startpage': coverStartpage,
  'ib-leaks': coverLeaks,
  'turkish-slang-dictionary': coverSlang,
  'why-mathematics-is-lonely': coverLonely,
};

export const squareImages: { [key: string]: StaticImageData } = {
  'how-to-practice-mathematics-as-an-art': coverSquareArt,
  'skip-list': coverSquareSkip,
  'results-of-my-lifes-last-two-years-are-out': coverSquareResults,
  'catter-blog': coverSquareCatter,
  'creating-a-clone-of-yourself': coverSquareClone,
  'procrastination': coverSquareProcrastination,
  'why-do-people-just-hate-mathematics': coverSquareHate,
  'purple-startpage': coverSquareStartpage,
  'ib-leaks': coverSquareLeaks,
  'turkish-slang-dictionary': coverSquareSlang,
  'why-mathematics-is-lonely': coverSquareLonely,
};

export const followNextImages: { [key: string]: StaticImageData } = {
  'melikechan': followNextMelikechan,
  'comeau': followNextComeau,
  'bendersky': followNextBendersky,
  'sophie': followNextSophie,
}