'use client';

import Image from 'next/image';
import type { Project } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';

type ProjectCardProps = {
  project: Project;
  onClick: () => void;
};

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card
      className="group cursor-pointer transition-all duration-300 bg-transparent hover:bg-black/5 border-stone-400/50 shadow-sm hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader className="flex-row items-start justify-between pb-2">
        <CardTitle className="text-xl font-semibold text-page-foreground">{project.name}</CardTitle>
        <ArrowUpRight className="h-5 w-5 text-page-foreground/50 transition-transform duration-300 group-hover:rotate-45 group-hover:text-primary" />
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4 pt-2">
        <div className="relative w-full md:w-1/3 aspect-video overflow-hidden rounded-md border border-stone-300">
           <Image
              src={project.imageUrl}
              alt={project.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={project.imageHint}
            />
        </div>
        <div className="flex-1">
          <p className="mb-4 text-page-foreground/70 line-clamp-2">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="outline" className="border-amber-900/50 text-amber-900/80">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
