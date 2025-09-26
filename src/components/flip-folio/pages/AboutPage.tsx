'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import type { PersonalInfo } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Droplet, Flag, Briefcase, Heart, Target } from 'lucide-react';

type AboutPageProps = {
  personalInfo: PersonalInfo;
  imageUrl: string;
  imageHint: string;
};

const personalInfoIcons = {
  dob: Calendar,
  bloodGroup: Droplet,
  nationality: Flag,
  occupation: Briefcase,
  status: Heart,
  hobby: Target,
  aimInLife: Target
};

export default function AboutPage({ personalInfo, imageUrl, imageHint }: AboutPageProps) {
  
  const personalDetails = [
    { label: 'Born', value: new Date(personalInfo.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), icon: personalInfoIcons.dob },
    { label: 'Blood Group', value: personalInfo.bloodGroup, icon: personalInfoIcons.bloodGroup },
    { label: 'Nationality', value: personalInfo.nationality, icon: personalInfoIcons.nationality },
    { label: 'Occupation', value: personalInfo.occupation, icon: personalInfoIcons.occupation },
    { label: 'Hobby', value: personalInfo.hobby, icon: personalInfoIcons.hobby },
    { label: 'Ambition', value: personalInfo.aimInLife, icon: personalInfoIcons.aimInLife },
  ];

  return (
    <ScrollArea className="h-full w-full -mr-4 pr-4">
        <div className="flex flex-col p-2 md:p-0">
          <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
             <div className="md:w-1/3 flex-shrink-0">
                <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden border-2 border-amber-900/30 shadow-lg group">
                    <Image
                        src={imageUrl}
                        alt="Author's Photo"
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={imageHint}
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
            </div>
            <div className="md:w-2/3">
                 <h2 className="font-headline text-2xl sm:text-3xl mb-3 text-page-foreground">
                    {personalInfo.name}
                </h2>
                 <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-page-foreground/80">
                    {personalDetails.map(detail => (
                        <div key={detail.label} className="flex items-center gap-2">
                            <detail.icon className="h-4 w-4 text-primary" />
                            <span><strong>{detail.label}:</strong> {detail.value}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          <Card className='bg-transparent border-stone-400/50'>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-xl text-page-foreground">
                    <User className="h-5 w-5 text-primary"/>
                    About Me
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm leading-relaxed text-page-foreground/80">
                    I'm a hands-on tech explorer who dives into any technical issue, finds innovative solutions, and stays updated with the latest tech trends - a true 'Jugadu Technophile'. Since 2016, I've been solving diverse tech issues using creative methods and AI tools, and I'm always exploring new technologies.
                </p>
            </CardContent>
          </Card>
        </div>
    </ScrollArea>
  );
}
