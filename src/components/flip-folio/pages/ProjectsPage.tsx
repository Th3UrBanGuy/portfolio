'use client';

import type { Project } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProjectCard from '../ProjectCard';

type ProjectsPageProps = {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
};

export default function ProjectsPage({ projects, onProjectSelect }: ProjectsPageProps) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mb-6 flex-shrink-0 text-primary">
        Projects
      </h2>
      <ScrollArea className="flex-grow -mr-6">
        <div className="space-y-6 pr-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => onProjectSelect(project)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
