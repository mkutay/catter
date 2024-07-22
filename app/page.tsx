import DoublePane from '@/components/doublePane';
import ListPosts from '@/components/listPosts';
import { siteConfig } from '@/config/site';

export default function Home() {
  return (
    <DoublePane>
      <h1>
        Recently Published
      </h1>
      <hr/>
      <ListPosts startInd={0} endInd={siteConfig.postNumPerPage}/>
    </DoublePane>
  )
}