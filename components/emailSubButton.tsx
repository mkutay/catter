import Link from 'next/link';
import { Mailbox } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

export default function EmailSubButton() {
  return (
    <div className="grid grid-rows-1 gap-4 prose-p:my-0">
      <p className="text-lg col-auto">
        Subscribe to my newsletter to get updates on new posts and email only specials.
      </p>
      <div className="flex justify-center items-center not-prose">
        <Button variant="secondary" size="lg" asChild>
          <Link href={siteConfig.newsletterSubscribe} className="flex flex-row gap-3">
            <Mailbox stroke="currentColor" strokeWidth="1.8px"/>
            <div>Subscribe!</div>
          </Link>
        </Button>
      </div>
    </div>
  );
}