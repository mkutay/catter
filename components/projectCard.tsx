import { getProps } from '@/lib/projectQueries';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { components, options } from '@/lib/mdxRemoteSettings';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProjectCard({ slug }: { slug: string }) {
  const props = getProps('content/projects', slug);

  return (
    <Card className="not-prose">
      <CardHeader>
        <CardTitle>{props.meta.title}</CardTitle>
        <CardDescription>{props.meta.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p><MDXRemote source={props.meta.excerpt} options={options} components={components}/></p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/projects/${props.slug}`} className="text-foreground">
            Find Out More!
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}