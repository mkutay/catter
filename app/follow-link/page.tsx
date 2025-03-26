import Link from 'next/link';

import DoublePane from '@/components/doublePane';
import { siteConfig } from '@/config/site';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image, { StaticImageData } from 'next/image';
import { Button } from '@/components/ui/button';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { components, options } from '@/lib/mdxRemoteSettings';

export default function Page() {
  return (
    <DoublePane hideFollowLink>
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-wide text-primary uppercase my-6">
        Follow all these awesome people
      </h1>
      <div className="flex flex-col gap-2">
        {siteConfig.followNext.map((website) => (
          <FollowCard key={website.title} website={website} />
        ))}
      </div>
    </DoublePane>
  );
}

function FollowCard({ website }: {
  website: {
    title: string,
    link: string,
    description: string,
    image: StaticImageData,
  },
}) {
  return (
    <Card className="sm:flex-row flex-col flex">
      <div className="sm:m-2 m-4 sm:w-1/3">
        <Image
          alt={`An image about ${website.title}`}
          src={website.image}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          className="rounded-xl shadow-md"
          placeholder="blur"
        />
      </div>
      <div className="sm:w-2/3 flex flex-col justify-between">
        <div>
          <CardHeader>
            <CardTitle>{website.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <MDXRemote source={website.description} options={options} components={components} />
          </CardContent>
        </div>
        <CardFooter className="flex justify-end">
          <Button asChild variant="outline">
            <Link href={website.link} className="text-foreground">
              {`Go To ${website.title.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`}
            </Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}