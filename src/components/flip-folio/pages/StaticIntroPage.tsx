'use client';

import { BookLock, KeyRound, Mouse, MoveHorizontal } from "lucide-react";


export default function StaticIntroPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center bg-page-background text-page-foreground rounded-lg p-8 shadow-inner-lg font-handwriting"
        >
      
        <div className="mb-6">
            <BookLock className="h-24 w-24 text-page-foreground/50" />
        </div>

        <h1 className="font-headline text-3xl font-bold tracking-wider text-page-foreground">
            Welcome, Seeker
        </h1>
        <p className="mt-3 max-w-xs text-xl text-page-foreground/70">
            You have found the Arcane Codex. Within these pages lies the chronicle of a technophile's journey. Click 'Unseal' to begin your exploration.
        </p>

        <div className="mt-8 text-lg text-page-foreground/60 space-y-3">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <Mouse className="h-4 w-4" />
                    <span>Scroll:</span>
                </div>
                <span>Read page content</span>
            </div>
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <MoveHorizontal className="h-4 w-4" />
                    <span>Buttons:</span>
                </div>
                <span>Turn pages</span>
            </div>
        </div>
    </div>
  );
}
