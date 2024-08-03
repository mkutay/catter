import DoublePane from '@/components/doublePane';
import ProjectCard from '@/components/projectCard';
import { getPosts } from '@/lib/contentQueries';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Different Coding Projects I Did',
  description: 'A list for the different projects I did/do in my free time accumulated here.',
  keywords: ['projects', 'coding', 'web development'],
  openGraph: {
    title: 'Different Coding Projects I Did',
    description: 'A list for the different projects I did/do in my free time accumulated here.',
    url: siteConfig.url + '/projects',
    locale: 'en_UK',
    type: 'website',
    images: ['images/favicon.png'],
    siteName: siteConfig.name,
  },
};

export default function Page() {
  const projects = getPosts({ tags: ['project'] });

  return (
    <DoublePane>
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-wide text-secondary uppercase my-6">
        Different Coding Projects I Did
      </h1>
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 my-6">
        {projects.map((project) => (
          <ProjectCard props={project} key={project.slug}/>
        ))}
      </div>
    </DoublePane>
  );
}