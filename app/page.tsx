import { Telescope } from 'lucide-react';
import Link from 'next/link';

import DoublePane from '@/components/doublePane';
import ListPosts from '@/components/listPosts';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

export default function Home() {
  return (
    <DoublePane>
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-wide text-primary uppercase my-6">
        Recently Published
      </h1>
      <ListPosts startInd={0} endInd={siteConfig.postNumPerPage} disallowTags={['project']}/>
      <Button asChild variant="default" className="flex mx-auto w-fit mt-6" size="lg">
        <Link href="/posts/page/1" className="flex flex-row gap-3">
          <Telescope stroke="currentColor" strokeWidth="1.8px"/>
          <div>Look At My Other Posts!</div>
        </Link>
      </Button>
    </DoublePane>
  )
}