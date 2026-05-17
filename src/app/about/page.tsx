import type { Metadata } from "next";
import Image from "next/image";
import { DoublePane } from "@/components/double-pane";
import { TypographyH1 } from "@/components/typography/headings";
import { siteConfig } from "@/config/site";
import { getAboutProps } from "@/lib/content-queries";
import { getImagePlaceholder } from "@/lib/images";
import { RenderPost } from "@/lib/rendering";

export const dynamic = "force-static";

const about = getAboutProps();

export const metadata: Metadata = {
  title: about.meta.title,
  description: about.meta.description,
  openGraph: {
    title: about.meta.title,
    description: about.meta.description,
    url: `${siteConfig.url}/about`,
  },
};

export default async function Page() {
  const { metadata, base64, url } = await getImagePlaceholder("/me.jpg");
  return (
    <div>
      <div className="bg-primary w-screen h-fit py-6 lg:space-y-16 lg:pt-24 pt-16 pb-6">
        <div className="lg:max-w-6xl max-w-prose px-4 mx-auto text-primary-foreground lg:space-y-4 space-y-2">
          <TypographyH1>{about.meta.title}</TypographyH1>
          <p className="leading-7 not-first:mt-6">{about.meta.description}</p>
        </div>
      </div>
      <DoublePane>
        <div className="my-6">
          <Image
            alt={`${siteConfig.author} portrait image`}
            src={url}
            placeholder={base64}
            className="rounded-full shadow-md max-w-64 lg:float-right mx-auto"
            width={metadata.width}
            height={metadata.height}
          />
        </div>
        <main>
          <RenderPost source={about.content} />
        </main>
      </DoublePane>
    </div>
  );
}
