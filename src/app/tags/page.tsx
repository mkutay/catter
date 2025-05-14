import TagsButtonGrid from '@/components/tagsButtonGrid';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-static';

export function generateMetadata() {
  return {
    title: `List of Tags on the Posts`,
    description: `List and buttons of all the tags that posts have on ${siteConfig.name}.`,
    openGraph: {
      title: `List of Tags on the Posts`,
      description: `List and buttons of all the tags that posts have on ${siteConfig.name}.`,
      url: `${siteConfig.url}/tags`,
      images: ['images/favicon.png'],
    },
  };
}

export default function Page() {
  return (
    <>
      <h1 className="scroll-m-20 text-3xl font-semibold tracking-wide text-primary uppercase my-6">
        List of Tags on the Blog
      </h1>
      <TagsButtonGrid />
    </>
  )
}