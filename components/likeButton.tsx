'use client';

import { useState } from 'react';

import { incrementLikes } from '@/lib/dataBaseActions';

export default function LikeButton({
  slug,
  allLikes,
}: {
  slug: string;
  allLikes: {
    slug: string;
    count: number;
  }[];
  trackLike?: boolean;
}) {
  const likesForSlug = allLikes && allLikes.find((view) => view.slug === slug);
  const number = likesForSlug?.count || 0;

  const [likes, setLikes] = useState(0);

  async function likeChange() {
    await incrementLikes(slug);
    if (likes == 0) {
      setLikes(number + 1);
    } else {
      setLikes(likes + 1);
    }
  }

  return (
    <div>
      <button
        className="w-full items-center justify-center border border-[#bcc0cc] dark:border-[#45475a] bg-[#e6e9ef] dark:bg-[#181825] rounded-md p-4 not-prose inline-flex text-[#4c4f69] dark:text-[#cdd6f4] mb-6"
        onClick={() => likeChange()}
      >
        {/* <Image alt="GitHub logo" src="/github-logo.svg" width="20" height="20"/> */}
        <div className="ml-4 text-[#4c4f69] dark:text-[#cdd6f4]">
          {likes || number} likes
        </div>
      </button>
    </div>
  );
}