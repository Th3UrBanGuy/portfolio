'use client';

import Image from 'next/image';
import type { Project } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

type ProjectDetailDialogProps = {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ProjectDetailDialog({
  project,
  open,
  onOpenChange,
}: ProjectDetailDialogProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 !rounded-xl overflow-hidden transform scale-100 transition-all duration-300 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 glass">
        <div className="relative h-64 w-full">
          <Image
            src={project.imageUrl}
            alt={project.name}
            fill
            className="object-cover"
            data-ai-hint={project.imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
        <div className="p-6 pt-0 -mt-16 relative z-10">
            <DialogHeader className='mb-4'>
                <DialogTitle className="text-3xl font-bold text-white">{project.name}</DialogTitle>
            </DialogHeader>

            <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                <Badge key={tech} variant="outline" className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                    {tech}
                </Badge>
                ))}
            </div>

            <ScrollArea className="h-40">
              <DialogDescription className="text-base text-muted-foreground pr-4">
                {project.description}
              </DialogDescription>
            </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
