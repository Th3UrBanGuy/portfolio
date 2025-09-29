'use client';

import type { Achievement } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Feather, Sparkles } from 'lucide-react';
import Image from 'next/image';

type AchievementsPageProps = {
  achievements: Achievement[];
};

export default function AchievementsPage({ achievements }: AchievementsPageProps) {
  const sortedAchievements = [...achievements].sort((a, b) => a.id.localeCompare(b.id));
  return (
    <div className="h-full flex flex-col">
      <h2 className="font-headline text-2xl mb-4 flex-shrink-0 text-page-foreground">
        Deeds of Valor
      </h2>
      <ScrollArea className="flex-grow -mr-6">
        <div className="space-y-6 pr-6">
          {achievements.map((ach) => (
            <Card key={ach.id} className="bg-transparent border-stone-400/50 overflow-hidden">
              <div className="grid md:grid-cols-3">
                <div className="md:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-page-foreground flex items-start gap-3">
                      <Award className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>{ach.title}</span>
                    </CardTitle>
                    <CardDescription className="text-page-foreground/70 text-xs pt-1">
                      {ach.short_description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs">
                    <div>
                      <h4 className="font-semibold text-page-foreground/90 mb-1 flex items-center gap-2"><Sparkles className='w-4 h-4 text-primary/80' />How it was Achieved</h4>
                      <p className="text-page-foreground/70">{ach.how_achieved}</p>
                    </div>
                     <div>
                      <h4 className="font-semibold text-page-foreground/90 mb-1 flex items-center gap-2"><Feather className='w-4 h-4 text-primary/80' />My Thoughts</h4>
                      <p className="text-page-foreground/70 italic">"{ach.words_about_it}"</p>
                    </div>
                  </CardContent>
                </div>
                <div className="md:col-span-1 p-4 flex items-center justify-center">
                    <a href={ach.certificate_image_url} target='_blank' rel='noopener noreferrer' className='block w-full aspect-[4/3] relative rounded-md overflow-hidden border-2 border-amber-900/30 shadow-lg group'>
                        <Image
                            src={ach.certificate_image_url}
                            alt={ach.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                         <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="text-white text-xs bg-black/50 px-2 py-1 rounded-md">View Certificate</span>
                        </div>
                    </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
