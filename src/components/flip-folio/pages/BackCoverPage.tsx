'use client';

import { BookLock } from 'lucide-react';

type BackCoverPageProps = {};

const GlyphIcon = () => (
    <svg viewBox="0 0 100 100" className="h-24 w-24 text-primary" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 5 L95 50 L50 95 L5 50 Z" stroke="hsl(var(--primary) / 0.8)" strokeWidth="2" fill="hsl(var(--primary) / 0.1)" />
        <path d="M50 20 L80 50 L50 80 L20 50 Z" stroke="hsl(var(--primary) / 0.9)" strokeWidth="1.5" strokeLinejoin="round" fill="hsl(var(--primary) / 0.2)"/>
        <path d="M50 35 L65 50 L50 65 L35 50 Z" stroke="hsl(var(--primary))" strokeWidth="1" strokeLinejoin="round"/>
        <circle cx="50" cy="50" r="3" fill="hsl(var(--primary))"/>
    </svg>
)


export default function BackCoverPage({}: BackCoverPageProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center bg-stone-950 rounded-lg shadow-2xl p-8 border-t-2 border-amber-900/80 border-x-2 border-x-amber-950/50"
         style={{
            backgroundImage: 'radial-gradient(circle at center, hsl(var(--background)), hsl(224, 71%, 2%)), url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c0840c\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M50 50 L50 0 L80 0 L80 80 L0 80 L0 50 Z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
         }}>
      
    </div>
  );
}
