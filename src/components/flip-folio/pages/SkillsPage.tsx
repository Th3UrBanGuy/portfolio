'use client';

import type { Skill } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type SkillsPageProps = {
  skills: Skill[];
  onSkillSelect: (skill: Skill) => void;
};

const Icon = ({ name, ...props }: { name: string } & LucideIcons.LucideProps) => {
  const LucideIcon = LucideIcons[name as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
  if (!LucideIcon) {
    // Return a default icon if the specified one doesn't exist.
    return <LucideIcons.Star {...props} />;
  }
  return <LucideIcon {...props} />;
};


export default function SkillsPage({ skills, onSkillSelect }: SkillsPageProps) {
  const categories = [
    'Cyber Security',
    'System Administration',
    'Web Development',
    'Design & Branding',
    'Programming',
    'Deployment',
    'Tools',
    'Soft Skills'
  ];

  const categorizedSkills = categories.map(category => ({
    name: category,
    skills: skills.filter(skill => skill.category === category)
  })).filter(category => category.skills.length > 0);

  return (
    <div className="h-full flex flex-col">
      <h2 className="font-headline text-2xl mb-4 flex-shrink-0 text-page-foreground">
        Skills & Arcana
      </h2>
      <ScrollArea className="flex-grow -mr-6">
        <div className="space-y-6 pr-6">
          {categorizedSkills.map((category) => (
            <div key={category.name}>
              <h3 className="font-headline text-lg text-primary mb-3">{category.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.skills.map((skill) => (
                  <Card
                    key={skill.id}
                    className="group cursor-pointer transition-all duration-300 bg-transparent hover:bg-black/5 border-stone-400/50 shadow-sm hover:shadow-md"
                    onClick={() => onSkillSelect(skill)}
                  >
                    <CardHeader className="flex flex-col items-center justify-center text-center p-4">
                      <Icon name={skill.icon} className="h-7 w-7 mb-2 text-primary transition-transform duration-300 group-hover:scale-110" />
                      <CardTitle className="text-xs font-semibold text-page-foreground">{skill.name}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
