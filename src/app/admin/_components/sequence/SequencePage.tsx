'use client';

import { useState, useEffect } from 'react';
import { getDocumentData } from '@/lib/placeholder-data';
import { SequenceForm } from './components';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Page, ALL_PAGES } from '@/lib/types';


type AdminView =
  | 'dashboard'
  | 'profile'
  | 'private-info'
  | 'education'
  | 'skills'
  | 'experience'
  | 'achievements'
  | 'projects'
  | 'contact'
  | 'sequence'
  | 'security';

type SequencePageProps = {
  setActiveView: (view: AdminView) => void;
};

export default function SequencePage({ setActiveView }: SequencePageProps) {
  const [sequence, setSequence] = useState<Page[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getDocumentData<{ sequence: Page[] }>('site-data', 'page-sequence');
      if (data?.sequence) {
        // Ensure all pages are present, add new ones if they are not
        const currentPages = new Set(data.sequence);
        const fullSequence = [...data.sequence];
        ALL_PAGES.forEach(page => {
            if (!currentPages.has(page)) {
                fullSequence.push(page);
            }
        });
        setSequence(fullSequence);
      } else {
        setSequence(ALL_PAGES);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Manage Page Sequence</CardTitle>
                <CardDescription>
                    Drag and drop to reorder the pages in your portfolio flipbook.
                </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={() => setActiveView('dashboard')}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
        </CardHeader>
      </Card>
      {loading || !sequence ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <SequenceForm initialSequence={sequence} />
      )}
    </div>
  );
}
