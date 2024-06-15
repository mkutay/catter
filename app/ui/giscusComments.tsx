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
        // data-theme={theme === "dark" ? "http://localhost:3000/css/giscus-dark.css" : "http://localhost:3000/css/giscus-light.css"}
        theme={theme === "dark" ? "transparent_dark" : "light"}
        loading="lazy"
        lang="en"
      />
    </div>
  );
};
