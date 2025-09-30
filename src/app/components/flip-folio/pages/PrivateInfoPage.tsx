'use client';

import type { PrivateInfo } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User, MapPin, Building, ExternalLink, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, ...props }: { name: string } & LucideIcons.LucideProps) => {
  const LucideIcon = LucideIcons[name as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
  if (!LucideIcon) {
    return <FileText {...props} />;
  }
  return <LucideIcon {...props} />;
};


type PrivateInfoPageProps = {
  privateInfo: PrivateInfo;
  title: string;
};

export default function PrivateInfoPage({ privateInfo, title }: PrivateInfoPageProps) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="font-headline text-2xl mb-4 flex-shrink-0 text-page-foreground">
        {title}
      </h2>
      
      <ScrollArea className="flex-grow -mr-6">
        <div className="space-y-6 pr-6">
            <Card className='bg-transparent border-stone-400/50'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline text-lg text-page-foreground">
                        <Users className="h-5 w-5 text-primary"/>
                        Family Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className="flex items-start gap-3">
                            <User className="h-4 w-4 text-primary/80 flex-shrink-0 mt-1" />
                            <div>
                                <p className='text-page-foreground/70'>Father</p>
                                <p className="font-semibold text-page-foreground/90">{privateInfo.father_name}</p>
                                <p className='text-page-foreground/80 text-xs'>{privateInfo.father_occupation}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <User className="h-4 w-4 text-primary/80 flex-shrink-0 mt-1" />
                            <div>
                                <p className='text-page-foreground/70'>Mother</p>
                                <p className="font-semibold text-page-foreground/90">{privateInfo.mother_name}</p>
                                <p className='text-page-foreground/80 text-xs'>{privateInfo.mother_occupation}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className='bg-transparent border-stone-400/50'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline text-lg text-page-foreground">
                        <MapPin className="h-5 w-5 text-primary"/>
                        Address
                    </CardTitle>
                </CardHeader>
                 <CardContent className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                        <Building className="h-4 w-4 text-primary/80 flex-shrink-0 mt-1" />
                        <div>
                            <p className='text-page-foreground/70'>Present Address</p>
                            <p className="font-medium text-page-foreground/90">{privateInfo.present_address}</p>
                        </div>
                    </div>
                    <Separator className='bg-stone-400/30' />
                     <div className="flex items-start gap-3">
                        <Building className="h-4 w-4 text-primary/80 flex-shrink-0 mt-1" />
                        <div>
                            <p className='text-page-foreground/70'>Permanent Address</p>
                            <p className="font-medium text-page-foreground/90">{privateInfo.permanent_address}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {privateInfo.documents && privateInfo.documents.length > 0 && (
                 <Card className='bg-transparent border-stone-400/50'>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 font-headline text-lg text-page-foreground">
                            <FileText className="h-5 w-5 text-primary"/>
                            Private Documents
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {privateInfo.documents.map(doc => (
                            <Button
                                key={doc.id}
                                variant="outline"
                                className="w-full justify-start h-11 bg-transparent border-stone-400/50 text-page-foreground hover:bg-black/5 hover:border-primary/80"
                                asChild
                            >
                                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                    <DynamicIcon name={doc.icon_name} className="mr-2.5 h-4 w-4 text-primary" />
                                    <span className="font-semibold text-sm">{doc.label}</span>
                                    <ExternalLink className="h-4 w-4 text-page-foreground/50 ml-auto" />
                                </a>
                            </Button>
                        ))}
                    </CardContent>
                 </Card>
            )}

        </div>
      </ScrollArea>
    </div>
  );
}
