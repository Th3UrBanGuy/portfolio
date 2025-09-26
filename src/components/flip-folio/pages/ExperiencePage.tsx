'use client';

import type { Experience } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, MapPin, Calendar } from 'lucide-react';

type ExperiencePageProps = {
  experience: Experience[];
};

export default function ExperiencePage({ experience }: ExperiencePageProps) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="font-headline text-2xl mb-4 flex-shrink-0 text-page-foreground">
        Chronicles of Experience
      </h2>
      <ScrollArea className="flex-grow -mr-6">
        <div className="space-y-4 pr-6">
          {experience.map((exp) => (
            <Card key={exp.id} className="bg-transparent border-stone-400/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-page-foreground">{exp.role}</CardTitle>
                <CardDescription className="text-page-foreground/70 flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-xs">
                    <span className="flex items-center"><Briefcase className="mr-2 h-4 w-4"/>{exp.company}</span>
                    <span className="flex items-center"><MapPin className="mr-2 h-4 w-4"/>{exp.location}</span>
                    <span className="flex items-center"><Calendar className="mr-2 h-4 w-4"/>{exp.duration}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-page-foreground/80">{exp.short_description}</p>
                <ul className="list-disc list-inside space-y-1 text-page-foreground/70 text-xs">
                    {exp.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
