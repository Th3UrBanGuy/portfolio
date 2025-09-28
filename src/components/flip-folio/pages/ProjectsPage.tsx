'use client';

import type { Project } from '@/lib/types';
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
  onProjectSelect: (project: Project) => void;
};

export default function ProjectsPage({ projects, onProjectSelect }: ProjectsPageProps) {
  const smallerProjects = projects.filter(p => p.category === "Urban Projects (Smaller Projects)");
  const biggerProjects = projects.filter(p => p.category !== "Urban Projects (Smaller Projects)");


  return (
    <div className="h-full flex flex-col">
      <h2 className="font-headline text-2xl mb-4 flex-shrink-0 text-page-foreground">
        Creations & Constructs
      </h2>
      <ScrollArea className="flex-grow -mr-6">
        <div className="space-y-6 pr-6">
          {/* Bigger projects will be listed here directly */}
          <div className="space-y-4">
            {biggerProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => onProjectSelect(project)}
              />
            ))}
          </div>

          {/* Smaller projects in an accordion */}
          {smallerProjects.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className='border-stone-400/50 rounded-lg border px-4 bg-black/5'>
                <AccordionTrigger className='font-headline text-lg text-primary hover:no-underline [&[data-state=open]>svg]:text-primary'>
                  <div className='flex items-center gap-3'>
                    <FolderArchive className='w-6 h-6' />
                    Urban Projects (Smaller Projects)
                  </div>
                </AccordionTrigger>
                <AccordionContent className='pt-4'>
                  <div className="space-y-4">
                    {smallerProjects.map((project) => (
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
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
