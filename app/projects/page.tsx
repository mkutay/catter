import DoublePane from "@/components/doublePane";
import ProjectCard from "@/components/projectCard";
import { getProjectFiles } from "@/lib/projectQueries";

export default function Page() {
  const projects = getProjectFiles().map(filename => filename.replace('.mdx', ''));

  return (
    <DoublePane>
      <div className="grid grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectCard slug={project} key={project}/>
        ))}
      </div>
    </DoublePane>
  );
}