'use client';

import { Swords } from "lucide-react";


export default function StaticOutroPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center bg-stone-950 rounded-lg shadow-2xl p-8 border-t-2 border-amber-900/80 border-x-2 border-x-amber-950/50"
         style={{
            backgroundImage: 'radial-gradient(circle at center, hsl(var(--background)), hsl(224, 71%, 2%)), url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c0840c\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M50 50 L50 0 L80 0 L80 80 L0 80 L0 50 Z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
         }}>
      
        <div className="mb-6">
            <Swords className="h-24 w-24 text-primary/70" />
        </div>

        <h1 className="font-headline text-3xl font-bold tracking-wider text-amber-50">
            Thank You
        </h1>
        <p className="mt-3 max-w-xs text-sm text-amber-200/60">
            Your journey through the codex is complete. If my work resonates with you, I would be honored to connect and explore new possibilities together.
        </p>
    </div>
  );
}