import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { TypographyH1 } from "@/components/typography/headings";
import { siteConfig } from "@/config/site";
import { getPosts } from "@/lib/dbContentQueries";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Different Coding Projects I Did",
  description:
    "A list for the different projects I did/do in my free time accumulated here.",
  keywords: ["projects", "coding", "web development"],
  openGraph: {
    title: "Different Coding Projects I Did",
    description:
      "A list for the different projects I did/do in my free time accumulated here.",
    url: `${siteConfig.url}/projects`,
    locale: "en_UK",
    type: "website",
    images: ["images/favicon.png"],
    siteName: siteConfig.name,
  },
};

export default async function Page() {
  const projects = await getPosts({ tags: ["project"] });
  if (projects.isErr()) throw new Error(projects.error.message);

  return (
    <div className="md:max-w-6xl max-w-prose mx-auto w-full px-4">
      <TypographyH1 className="mt-6 mb-8 text-primary">
        My Projects
      </TypographyH1>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 my-8">
        {projects.value.map((project) => (
          <ProjectCard props={project} key={project.slug} />
        ))}
      </div>
    </div>
  );
}
