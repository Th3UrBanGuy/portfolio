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
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/50"
      onClick={onClick}
    >
      <CardHeader className="flex-row items-start justify-between">
        <CardTitle className="text-xl font-semibold">{project.name}</CardTitle>
        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:rotate-45 group-hover:text-primary" />
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-1/3 aspect-video overflow-hidden rounded-md">
           <Image
              src={project.imageUrl}
              alt={project.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={project.imageHint}
            />
        </div>
        <div className="flex-1">
          <p className="mb-4 text-muted-foreground line-clamp-2">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
