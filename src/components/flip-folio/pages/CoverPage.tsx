'use client';

import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

type CoverPageProps = {
  onOpen: () => void;
};

const GlyphIcon = () => (
    <svg viewBox="0 0 100 100" className="h-24 w-24 text-primary animate-pulse-glow" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
            </filter>
        </defs>
        <path d="M50 5 L95 50 L50 95 L5 50 Z" stroke="hsl(var(--primary) / 0.8)" strokeWidth="2" fill="hsl(var(--primary) / 0.1)" filter="url(#glow)"/>
        <path d="M50 20 L80 50 L50 80 L20 50 Z" stroke="hsl(var(--primary) / 0.9)" strokeWidth="1.5" strokeLinejoin="round" fill="hsl(var(--primary) / 0.2)"/>
        <path d="M50 35 L65 50 L50 65 L35 50 Z" stroke="hsl(var(--primary))" strokeWidth="1" strokeLinejoin="round"/>
        <circle cx="50" cy="50" r="3" fill="hsl(var(--primary))"/>
    </svg>
)


export default function CoverPage({ onOpen }: CoverPageProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center bg-stone-950 rounded-lg shadow-2xl p-8 border-t-2 border-amber-900/80 border-x-2 border-x-amber-950/50"
         style={{
            backgroundImage: 'radial-gradient(circle at center, hsl(var(--background)), hsl(224, 71%, 2%)), url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c0840c\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M50 50 L50 0 L80 0 L80 80 L0 80 L0 50 Z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
         }}>
      
      <div className="mb-6">
        <GlyphIcon />
      </div>

      <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider text-amber-50"
          style={{ textShadow: '0 0 10px hsl(var(--primary) / 0.8), 0 0 25px hsl(var(--primary) / 0.6)' }}>
        The Arcane Codex
      </h1>
      <p className="mt-3 max-w-xs text-base text-amber-200/60">
        An Interactive Portfolio
      </p>
      <Button onClick={onOpen} className="mt-8 bg-primary/90 text-primary-foreground border-2 border-amber-300/80 hover:bg-primary/100 shadow-[0_0_20px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.7)] transition-all duration-300" size="lg">
        <Sparkles className="mr-2 h-5 w-5" />
        Unseal the Codex
      </Button>
    </div>
  );
}
