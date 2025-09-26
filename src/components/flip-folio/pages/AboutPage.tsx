'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

type AboutPageProps = {
  content: string;
};

export default function AboutPage({ content }: AboutPageProps) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mb-6 flex-shrink-0 text-page-foreground">
        About the Author
      </h2>
      <ScrollArea className="flex-grow">
        <div className="text-page-foreground/80 pr-4 space-y-4 text-base">
          {content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="leading-relaxed">{paragraph}</p>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
