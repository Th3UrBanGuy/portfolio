'use client';

import type { Project, ProjectBundle } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProjectCard from '../ProjectCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FolderArchive } from 'lucide-react';

type ProjectsPageProps = {
  projects: Project[];
  bundles: ProjectBundle[];
  onProjectSelect: (project: Project) => void;
  title: string;
};

export default function ProjectsPage({ projects, bundles, onProjectSelect, title }: ProjectsPageProps) {
  const featuredProjects = projects.filter(p => p.category === "Featured Projects");
  
  const bundleNames = bundles.map(b => b.name);
  const individualProjects = projects.filter(p => !p.category || !bundleNames.includes(p.category));

  const bundledProjects = bundles
    .map(bundle => ({
      ...bundle,
      projects: projects.filter(p => p.category === bundle.name && p.category !== "Featured Projects")
    }))
    .filter(bundle => bundle.projects.length > 0);


  return (
    <div className="h-full flex flex-col">
      <h2 className="font-headline text-2xl mb-4 flex-shrink-0 text-page-foreground">
        {title}
      </h2>
      <ScrollArea className="flex-grow -mr-6">
        <div className="space-y-6 pr-6">
          
          {/* Featured projects are always shown at the top */}
          {featuredProjects.length > 0 && (
            <div className="space-y-4">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => onProjectSelect(project)}
                />
              ))}
            </div>
          )}

          {/* Individual projects shown next */}
           {individualProjects.length > 0 && (
            <div className="space-y-4">
              {individualProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => onProjectSelect(project)}
                />
              ))}
            </div>
          )}

          {/* Bundled projects in accordions */}
          {bundledProjects.map(bundle => (
             <Accordion key={bundle.id} type="single" collapsible className="w-full">
              <AccordionItem value={bundle.id} className='border-stone-400/50 rounded-lg border px-4 bg-black/5'>
                <AccordionTrigger className='font-headline text-lg text-accent hover:no-underline [&[data-state=open]>svg]:text-accent'>
                  <div className='flex items-center gap-3'>
                    <FolderArchive className='w-6 h-6' />
                    {bundle.name}
                  </div>
                </AccordionTrigger>
                <AccordionContent className='pt-4'>
                  <div className="space-y-4">
                    {bundle.projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={() => onProjectSelect(project)}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
