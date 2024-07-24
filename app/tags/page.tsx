import { siteConfig } from '@/config/site';
import TagsButtonGrid from '@/components/tagsButtonGrid';
import EmailSubButton from '@/components/emailSubButton';

export function generateMetadata() {
  return {
    title: `List Of Tags On the Blog`,
    description: `List of all the tags that posts have on Kutay's Blog`,
    openGraph: {
      title: `List Of Tags On the Blog`,
      description: `List of all the tags that posts have on Kutay's Blog`,
      url: `${siteConfig.url}/tags`,
    },
  };
}

export default function Page() {
  return (
    <section className="max-w-prose mx-auto my-0 py-8 prose px-4 lg:px-8 prose-h1:my-0">
      <h1>
        Tags
      </h1>
      <hr/>
      <TagsButtonGrid/>
      <hr/>
      <EmailSubButton/>
    </section>
  )
}