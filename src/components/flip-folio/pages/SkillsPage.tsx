'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Star, Code, Cpu, BrainCircuit } from 'lucide-react';

type SkillsPageProps = {
  skills: string[];
};

export default function SkillsPage({ skills }: SkillsPageProps) {
  
  const getIconForSkill = (skill: string) => {
    const lcSkill = skill.toLowerCase();
    if (lcSkill.includes('ai')) return <BrainCircuit className="mr-2 h-4 w-4 text-primary/80" />;
    if (lcSkill.includes('html') || lcSkill.includes('css') || lcSkill.includes('python') || lcSkill.includes('c++') || lcSkill.includes('wordpress')) return <Code className="mr-2 h-4 w-4 text-primary/80" />;
    if (lcSkill.includes('linux') || lcSkill.includes('docker')) return <Cpu className="mr-2 h-4 w-4 text-primary/80" />;
    return <Star className="mr-2 h-4 w-4 text-primary/80" />;
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="font-headline text-2xl mb-6 flex-shrink-0 text-page-foreground">
        Skills & Arcana
      </h2>
      <ScrollArea className="flex-grow -mr-6">
        <div className="flex flex-wrap gap-2 pr-6">
          {skills.map((skill, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-sm font-normal py-1 px-3 border-amber-900/30 text-page-foreground/80 bg-black/5 items-center"
            >
              {getIconForSkill(skill)}
              <span>{skill}</span>
            </Badge>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
