'use client';

import type { PortfolioData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, ExternalLink, Github, Linkedin, Twitter, Facebook, Send, Smartphone } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const iconMap: { [key: string]: React.ComponentType<any> } = {
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  facebook: Facebook,
  telegram: Send,
  whatsapp: Smartphone,
};

export default function ContactPage({ contactDetails, socials }: { contactDetails: PortfolioData['contactDetails'], socials: PortfolioData['socials'] }) {
  
  return (
    <div className="flex h-full flex-col">
       <h2 className="font-headline text-2xl sm:text-3xl mb-4 text-page-foreground">
        Make Contact
      </h2>
      
      <p className="text-base text-page-foreground/80 mb-4">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team.
      </p>
      
      <ScrollArea className="flex-grow -mr-6 pr-6">
        <div className="space-y-4">

            {contactDetails.contactMeLink && (
            <Button asChild className="w-full h-14 text-base" size='lg'>
                <a href={contactDetails.contactMeLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-3 h-5 w-5" />
                    Find All My Links Here
                </a>
            </Button>
            )}

            <Card className='bg-transparent border-stone-400/50'>
            <CardContent className="p-4 space-y-3">
                <div className="flex items-center">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a href={`tel:${contactDetails.phone}`} className="ml-4 text-sm sm:text-base font-medium text-page-foreground/90 hover:text-primary break-all">
                    {contactDetails.phone}
                </a>
                </div>
                <div className="flex items-start">
                <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div className="ml-4 flex flex-col">
                    {contactDetails.emails.slice(0, 2).map(email => (
                        <a key={email} href={`mailto:${email}`} className="text-sm font-medium text-page-foreground/90 hover:text-primary break-all">
                            {email}
                        </a>
                    ))}
                </div>
                </div>
            </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
            {socials.map((social) => {
                const Icon = iconMap[social.id] || ExternalLink;
                return (
                    <Button
                        key={social.id}
                        variant="outline"
                        className="w-full justify-start h-12 bg-transparent border-stone-400/50 text-page-foreground hover:bg-black/5 hover:border-primary"
                        asChild
                    >
                    <a href={social.url} target="_blank" rel="noopener noreferrer">
                        <Icon className="mr-3 h-5 w-5 text-primary" />
                        <span className="font-semibold text-sm">{social.name}</span>
                    </a>
                    </Button>
                )
            })}
            </div>
        </div>
      </ScrollArea>
    </div>
  );
}
