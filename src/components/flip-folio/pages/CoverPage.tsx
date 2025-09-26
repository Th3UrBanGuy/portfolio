'use client';

import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

type CoverPageProps = {
  onOpen: () => void;
};

const GlyphIcon = () => (
    <svg viewBox="0 0 100 100" className="h-20 w-20 text-primary animate-pulse-glow" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 10 L90 50 L50 90 L10 50 Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
      <path d="M50 25 L75 50 L50 75 L25 50 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="50" cy="50" r="5" fill="currentColor"/>
    </svg>
)


export default function CoverPage({ onOpen }: CoverPageProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center bg-stone-900/90 rounded-lg shadow-2xl p-8 border-2 border-amber-900/50"
         style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23a16207\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}>
      
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 mb-6">
        <GlyphIcon />
      </div>

      <h1 className="font-headline text-5xl font-bold tracking-wider text-amber-100 sm:text-6xl md:text-7xl"
          style={{ textShadow: '0 0 5px hsl(var(--primary)), 0 0 10px hsl(var(--primary))' }}>
        The Arcane Codex
      </h1>
      <p className="mt-4 max-w-xs text-lg text-amber-200/70">
        An Interactive Portfolio
      </p>
      <Button onClick={onOpen} className="mt-8 bg-primary/20 text-primary-foreground border border-primary hover:bg-primary/30" size="lg">
        <Sparkles className="mr-2 h-4 w-4" />
        Unseal the Codex
      </Button>
    </div>
  );
}
