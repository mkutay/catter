import { Telescope } from 'lucide-react';
import Link from 'next/link';

import DoublePane from '@/components/doublePane';
import ListPosts from '@/components/listPosts';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

export default function Home() {
  return (
    <DoublePane>
      <div className="flex flex-col">
        <h1>
          Recently Published
        </h1>
        {/* <hr/> */}
        <ListPosts startInd={0} endInd={siteConfig.postNumPerPage} disallowTags={['project']}/>
        <Button asChild variant="secondary" className="not-prose mx-auto mt-4 mb-2" size="lg">
          <Link href="/posts/page/1" className="flex flex-row gap-3">
            <Telescope stroke="currentColor" strokeWidth="1.8px"/>
            <div>Look At My Other Posts!</div>
          </Link>
        </Button>
      </div>
    </DoublePane>
  )
}