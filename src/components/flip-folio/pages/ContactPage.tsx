'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

const socialLinks = [
  {
    name: 'GitHub',
    icon: Github,
    url: 'https://alahimajnurosama.github.io/',
    user: 'alahimajnurosama',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: '#',
    user: 'your-linkedin',
  },
  {
    name: 'X (Twitter)',
    icon: Twitter,
    url: 'https://twitter.com/AlahiMajnurOsama',
    user: '@AlahiMajnurOsama',
  },
];

export default function ContactPage() {
  return (
    <div className="flex h-full flex-col">
       <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mb-6 text-page-foreground">
        Make Contact
      </h2>
      <div className="flex-grow space-y-6">
        <p className="text-lg text-page-foreground/80">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team.
        </p>

        <Card className='bg-transparent border-stone-400/50'>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <Mail className="h-6 w-6 text-primary" />
              <a href="mailto:alahimajnurosama@gmail.com" className="ml-4 text-base sm:text-lg font-medium text-page-foreground/90 hover:text-primary break-all">
                alahimajnurosama@gmail.com
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {socialLinks.map((social) => (
            <Button
              key={social.name}
              variant="outline"
              className="w-full justify-start h-14 bg-transparent border-stone-400/50 text-page-foreground hover:bg-black/5 hover:border-primary"
              asChild
            >
              <a href={social.url} target="_blank" rel="noopener noreferrer">
                <social.icon className="mr-4 h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-semibold">{social.name}</div>
                  <div className="text-sm text-page-foreground/70">{social.user}</div>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
