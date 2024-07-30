import Link from 'next/link';
import { Mailbox } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function EmailSubButton() {
  return (
    <div className="grid grid-rows-1 gap-2 prose-p:my-0">
      <p className="text-lg col-auto">
        {/* <span className="text-[#8839ef] dark:text-[#cba6f7] underline">Subscribe</span> */}
        Subscribe to my newsletter to get updates on new posts and email only specials.
      </p>
      <div className="flex justify-center items-center not-prose">
        <Button variant="default" size="lg" asChild>
          <Link href="https://mkutay.substack.com/subscribe" className="flex flex-row gap-3">
            <Mailbox stroke="currentColor" strokeWidth="1.8px"/>
            <div>Subscribe!</div>
          </Link>
        </Button>
      </div>
    </div>
  );
}