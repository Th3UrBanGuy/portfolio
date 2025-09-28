'use client';

import type { Project } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProjectCard from '../ProjectCard';

type ProjectsPageProps = {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
};

export default function ProjectsPage({ projects, onProjectSelect }: ProjectsPageProps) {
  const categorizedProjects = projects.reduce((acc, project) => {
    const category = project.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  const categories = Object.keys(categorizedProjects);

  return (
    <div className="h-full flex flex-col">
      <h2 className="font-headline text-2xl mb-4 flex-shrink-0 text-page-foreground">
        Creations & Constructs
      </h2>
      <ScrollArea className="flex-grow -mr-6">
        <div className="space-y-6 pr-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="font-headline text-lg text-primary mb-3">{category}</h3>
              <div className="space-y-4">
                {categorizedProjects[category].map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => onProjectSelect(project)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
