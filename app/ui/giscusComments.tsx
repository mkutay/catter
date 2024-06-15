'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';
import { giscusConfigs } from '@/app/lib/giscusConfigs';

export default function Comment() {
  const { theme } = useTheme();

  return (
    <div id="comment" className="mx-auto max-w-prose pt-8 not-prose">
      <Giscus
        repo={giscusConfigs.repo}
        repoId={giscusConfigs.repoId}
        category={giscusConfigs.category}
        categoryId={giscusConfigs.categoryId}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme === "dark" ? "https://www.mkutay.dev/css/giscus-dark.css" : "https://www.mkutay.dev/css/giscus-light.css"}
        // theme={theme === "dark" ? "transparent_dark" : "light"}
        loading="lazy"
        lang="en"
      />
    </div>
  );
};
