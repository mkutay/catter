import Link from 'next/link';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote-client/rsc';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { components, options } from '@/config/mdxRemoteSettings';
import { followNextImages } from '@/config/images';

export const dynamic = 'force-static';

export default function Page() {
  return (
    <>
      <h1 className="scroll-m-20 text-3xl font-semibold tracking-wide text-primary uppercase my-6">
        Follow all these awesome people
      </h1>
      <div className="flex flex-col sm:gap-2 gap-4">
        {siteConfig.followNext.map((website, index) => (
          <FollowCard key={website.title} website={website} index={index} />
        ))}
      </div>
    </>
  );
}

function FollowCard({ website, index }: {
  website: {
    title: string,
    link: string,
    description: string,
    imagePath: string,
    shortened: string,
  },
  index: number,
}) {
  const image = followNextImages[website.shortened];
  return (
    <Card className="sm:odd:flex-row sm:even:flex-row-reverse flex-col flex">
      <div className="sm:m-2 m-4 sm:w-1/3">
        <Image
          alt={`An image about ${website.title}`}
          src={image}
          className="rounded-xl shadow-md"
          quality={50}
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
        <CardFooter className={`flex ${index % 2 === 0 ? 'sm:justify-end' : 'sm:justify-start'} justify-end`}>
          <Button asChild variant="outline">
            <Link href={website.link} className="text-foreground" target='_blank'>
              {`Go To ${website.title.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`}
            </Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}