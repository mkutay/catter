import TagsButtonGrid from '@/components/tagsButtonGrid';
import DoublePane from '@/components/doublePane';
import { siteConfig } from '@/config/site';

export function generateMetadata() {
  return {
    title: `List of Tags on the Posts`,
    description: `List and buttons of all the tags that posts have on Kutay's Blog.`,
    openGraph: {
      title: `List of Tags on the Posts`,
      description: `List and buttons of all the tags that posts have on Kutay's Blog.`,
      url: `${siteConfig.url}/tags`,
      images: ['images/favicon.png'],
    },
  };
}

export default function Page() {
  return (
    <DoublePane>
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-wide text-primary uppercase my-6">
        List of Tags on the Blog
      </h1>
      <hr/>
      <TagsButtonGrid/>
    </DoublePane>
  )
}