import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/*.json$",
        "/*_buildManifest.js$",
        "/*_middlewareManifest.js$",
        "/*_ssgManifest.js$",
        "/*.js$",
        "/*.woff2$",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
