'use client';

import { useTheme } from 'next-themes';
import Giscus from '@giscus/react';

import { giscusConfigs } from '@/config/giscus';
import { siteConfig } from '@/config/site';

export default function Comment() {
  const { theme } = useTheme();

  return (
    <Giscus
      repo={giscusConfigs.repo}
      repoId={giscusConfigs.repoId}
      category={giscusConfigs.category}
      categoryId={giscusConfigs.categoryId}
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme === "dark" ? `${siteConfig.url}/css/giscus-dark.css` : `${siteConfig.url}/css/giscus-light.css`}
      // theme={theme === "dark" ? "transparent_dark" : "light"}
      loading="lazy"
      lang="en"
    />
  );
};
