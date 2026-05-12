import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getPosts } from "@/lib/dbContentQueries";
import { getAboutProps } from "@/lib/fsContentQueries";

export default async function Sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteMap: MetadataRoute.Sitemap = [];

  siteMap.push({
    url: siteConfig.url,
    lastModified: siteConfig.date,
  });

  siteMap.push({
    url: `${siteConfig.url}/guestbook`,
    lastModified: siteConfig.date,
  });

  siteMap.push({
    url: `${siteConfig.url}/about`,
    lastModified: new Date(getAboutProps().meta.date)
      .toISOString()
      .split("T")[0],
  });

  const posts = await getPosts({});
  if (posts.isErr()) throw new Error(posts.error.message);

  posts.value.forEach((post) => {
    siteMap.push({
      url: `${siteConfig.url}/posts/${post.slug}`,
      lastModified: new Date(String(post.lastModified ?? post.date))
        .toISOString()
        .split("T")[0],
    });
  });

  siteMap.push({
    url: `${siteConfig.url}/posts`,
    lastModified: new Date(posts.value[0].date).toISOString().split("T")[0],
  });

  siteMap.push({
    url: `${siteConfig.url}/projects`,
    lastModified: new Date(
      posts.value.filter((p) => p.tags.includes("project"))[0].date,
    )
      .toISOString()
      .split("T")[0],
  });

  return siteMap;
}
