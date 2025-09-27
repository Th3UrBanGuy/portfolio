'use client';

import type { Skill } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react';

type SkillsPageProps = {
  skills: Skill[];
  onSkillSelect: (skill: Skill) => void;
};

const Icon = ({ name, ...props }: { name: string } & LucideIcons.LucideProps) => {
  const LucideIcon = LucideIcons[name as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
  if (!LucideIcon) return <LucideIcons.Star {...props} />;
  return <LucideIcon {...props} />;
};


export default function SkillsPage({ skills, onSkillSelect }: SkillsPageProps) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="font-headline text-2xl mb-4 flex-shrink-0 text-page-foreground">
        Skills & Arcana
      </h2>
      <ScrollArea className="flex-grow -mr-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pr-6">
          {skills.map((skill) => (
            <Card
              key={skill.id}
              className="group cursor-pointer transition-all duration-300 bg-transparent hover:bg-black/5 border-stone-400/50 shadow-sm hover:shadow-md"
              onClick={() => onSkillSelect(skill)}
            >
              <CardHeader className="flex flex-col items-center justify-center text-center p-4">
                <Icon name={skill.icon} className="h-8 w-8 mb-2 text-primary transition-transform duration-300 group-hover:scale-110" />
                <CardTitle className="text-sm font-semibold text-page-foreground">{skill.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
