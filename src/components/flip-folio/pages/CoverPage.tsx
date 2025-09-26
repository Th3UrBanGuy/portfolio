'use client';

import { Button } from '@/components/ui/button';
import { BookOpenCheck } from 'lucide-react';

type CoverPageProps = {
  onOpen: () => void;
};

export default function CoverPage({ onOpen }: CoverPageProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 mb-6">
        <BookOpenCheck className="h-12 w-12 text-primary" />
      </div>
      <h1 className="font-headline text-5xl font-bold tracking-tighter text-primary-dark sm:text-6xl md:text-7xl">
        FlipFolio
      </h1>
      <p className="mt-4 max-w-xs text-lg text-muted-foreground">
        Your Interactive Portfolio
      </p>
      <Button onClick={onOpen} className="mt-8" size="lg">
        Open
      </Button>
    </div>
  );
}
