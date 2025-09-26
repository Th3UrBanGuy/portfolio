'use client';

import { ScrollArea } from '@/components/ui/scroll-area';

type AboutPageProps = {
  content: string;
};

export default function AboutPage({ content }: AboutPageProps) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mb-6 flex-shrink-0 text-primary">
        About Me
      </h2>
      <ScrollArea className="flex-grow">
        <div className="prose prose-lg max-w-none text-muted-foreground pr-4 prose-p:mb-4">
          {content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
