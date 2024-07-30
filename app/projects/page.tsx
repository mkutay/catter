import DoublePane from "@/components/doublePane";
import ProjectCard from "@/components/projectCard";
import { getPosts } from "@/lib/contentQueries";

export default function Page() {
  const projects = getPosts({ tags: ['project'] });

  return (
    <DoublePane>
      <div className="grid grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectCard props={project} key={project.slug}/>
        ))}
      </div>
    </DoublePane>
  );
}