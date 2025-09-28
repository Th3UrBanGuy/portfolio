'use client';

import { Swords } from "lucide-react";


export default function StaticOutroPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center bg-page-background text-page-foreground rounded-lg p-8 shadow-inner-lg"
        >
      
        <div className="mb-6">
            <Swords className="h-24 w-24 text-page-foreground/50" />
        </div>

        <h1 className="font-headline text-3xl font-bold tracking-wider text-page-foreground">
            Thank You
        </h1>
        <p className="mt-3 max-w-xs text-sm text-page-foreground/70">
            Your journey through the codex is complete. If my work resonates with you, I would be honored to connect and explore new possibilities together.
        </p>
    </div>
  );
}
