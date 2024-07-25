import DoublePane from '@/components/doublePane';
import ListPosts from '@/components/listPosts';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import Link from 'next/link';

export default function Home() {
  return (
    <DoublePane>
      <div className="flex flex-col">
        <h1>
          Recently Published
        </h1>
        <hr/>
        <ListPosts startInd={0} endInd={siteConfig.postNumPerPage}/>
        <Button asChild variant="secondary" className="not-prose mx-auto mt-4 mb-2" size="lg">
          <Link href="/posts/page/2" className="text-base text-lg">
            Look At My Other Posts!
          </Link>
        </Button>
      </div>
    </DoublePane>
  )
}