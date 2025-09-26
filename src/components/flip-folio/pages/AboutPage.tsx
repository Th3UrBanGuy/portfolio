'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

type AboutPageProps = {
  content: string;
  imageUrl: string;
  imageHint: string;
};

export default function AboutPage({ content, imageUrl, imageHint }: AboutPageProps) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mb-6 flex-shrink-0 text-page-foreground">
        About the Author
      </h2>
      <div className="flex-grow flex flex-col md:flex-row gap-8">
        <ScrollArea className="flex-grow md:w-2/3">
            <div className="text-page-foreground/80 pr-4 space-y-4 text-base">
            {content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="leading-relaxed">{paragraph}</p>
            ))}
            </div>
        </ScrollArea>
        <div className="md:w-1/3 flex-shrink-0">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-amber-900/30 shadow-lg group">
                <Image
                    src={imageUrl}
                    alt="Author's Photo"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={imageHint}
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
        </div>
      </div>
    </div>
  );
}
