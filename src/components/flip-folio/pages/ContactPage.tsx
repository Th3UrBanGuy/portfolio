'use client';

import type { PortfolioData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, ExternalLink, Globe, Users } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const DynamicIcon = ({ name, ...props }: { name: string } & LucideIcons.LucideProps) => {
  const LucideIcon = LucideIcons[name as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
  if (!LucideIcon) {
    return <ExternalLink {...props} />;
  }
  return <LucideIcon {...props} />;
};


export default function ContactPage({ contactDetails, socials, customLinks }: { contactDetails: PortfolioData['contactDetails'], socials: PortfolioData['socials'], customLinks: PortfolioData['customLinks'] }) {
  
  return (
    <div className="flex h-full flex-col">
       <h2 className="font-headline text-2xl mb-4 text-page-foreground">
        Connect with the Scribe
      </h2>
      
      <p className="text-sm text-page-foreground/80 mb-6">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team. Reach out and let's create something magical.
      </p>
      
      <ScrollArea className="flex-grow -mr-6 pr-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
                <Card className='bg-transparent border-stone-400/50'>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-lg text-page-foreground">
                            <Mail className="h-5 w-5 text-primary"/>
                            Direct Channels
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                         {contactDetails.phoneNumbers && contactDetails.phoneNumbers.length > 0 && (
                            <div className="flex items-start gap-3">
                                <Phone className="h-4 w-4 text-primary/80 flex-shrink-0 mt-1" />
                                <div className="flex flex-col space-y-1">
                                {contactDetails.phoneNumbers.map(phone => (
                                    <a key={phone.id} href={`tel:${phone.number}`} className="font-medium text-page-foreground/90 hover:text-primary break-all">
                                        {phone.number}
                                    </a>
                                ))}
                                </div>
                            </div>
                         )}
                        
                        <Separator className='bg-stone-400/30' />

                        <div className="flex items-start gap-3">
                            <Mail className="h-4 w-4 text-primary/80 flex-shrink-0 mt-1" />
                            <div className="flex flex-col space-y-1">
                                {contactDetails.emails.map(email => (
                                    <a key={email} href={`mailto:${email}`} className="font-medium text-page-foreground/90 hover:text-primary break-all">
                                        {email}
                                    </a>
                                ))}
                            </div>
                        </div>

                    </CardContent>
                </Card>

                 {customLinks && customLinks.length > 0 && (
                    <div className="space-y-2">
                        {customLinks.map(link => (
                             <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                                <Card className='bg-transparent border-stone-400/50 hover:border-primary/50 hover:bg-black/5 transition-colors'>
                                    <CardHeader className="flex-row items-center gap-3 space-y-0 p-4">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 border border-primary/20">
                                            <DynamicIcon name={link.icon_name} className="h-5 w-5 text-primary"/>
                                        </div>
                                        <div>
                                            <CardTitle className="text-sm text-page-foreground">{link.label}</CardTitle>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-page-foreground/50 ml-auto" />
                                    </CardHeader>
                                </Card>
                            </a>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="space-y-4">
                <Card className='bg-transparent border-stone-400/50'>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-lg text-page-foreground">
                            <Users className="h-5 w-5 text-primary"/>
                            Social Realms
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {socials.map((social) => {
                            return (
                                <Button
                                    key={social.id}
                                    variant="outline"
                                    className="w-full justify-start h-11 bg-transparent border-stone-400/50 text-page-foreground hover:bg-black/5 hover:border-primary/80"
                                    asChild
                                >
                                <a href={social.url} target="_blank" rel="noopener noreferrer">
                                    <DynamicIcon name={social.icon_name} className="mr-2.5 h-4 w-4 text-primary" />
                                    <span className="font-semibold text-sm">{social.name}</span>
                                </a>
                                </Button>
                            )
                        })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </ScrollArea>
    </div>
  );
}
