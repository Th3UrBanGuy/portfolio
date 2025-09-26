'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

const socialLinks = [
  {
    name: 'GitHub',
    icon: Github,
    url: '#',
    user: 'your-github',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: '#',
    user: 'your-linkedin',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: '#',
    user: '@your_twitter',
  },
];

export default function ContactPage() {
  return (
    <div className="flex h-full flex-col">
       <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mb-6">
        Get in Touch
      </h2>
      <div className="flex-grow space-y-6">
        <p className="text-lg text-muted-foreground">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team.
        </p>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="h-6 w-6 text-primary" />
              <a href="mailto:hello@example.com" className="ml-4 text-lg font-medium hover:underline">
                hello@example.com
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {socialLinks.map((social) => (
            <Button
              key={social.name}
              variant="outline"
              className="w-full justify-start h-14"
              asChild
            >
              <a href={social.url} target="_blank" rel="noopener noreferrer">
                <social.icon className="mr-4 h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">{social.name}</div>
                  <div className="text-sm text-muted-foreground">{social.user}</div>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
