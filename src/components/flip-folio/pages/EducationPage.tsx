'use client';

import type { Education } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, School, Calendar, CheckCircle } from 'lucide-react';

type EducationPageProps = {
  education: Education[];
};

export default function EducationPage({ education }: EducationPageProps) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="font-headline text-2xl mb-4 flex-shrink-0 text-page-foreground">
        Scrolls of Knowledge
      </h2>
      <ScrollArea className="flex-grow -mr-6">
        <div className="space-y-4 pr-6">
          {education.map((edu) => (
            <Card key={edu.id} className="bg-transparent border-stone-400/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-page-foreground flex items-center gap-3">
                    <School className="h-5 w-5 text-primary"/>
                    {edu.institution}
                </CardTitle>
                <CardDescription className="text-page-foreground/70 flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-xs pt-1">
                    <span className="flex items-center"><Calendar className="mr-2 h-4 w-4"/>{edu.session}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-page-foreground/80 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{edu.details}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
