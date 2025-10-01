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
import { Page, ALL_PAGES, PageSequence } from '@/lib/types';


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
  const [sequence, setSequence] = useState<PageSequence | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getDocumentData<PageSequence | { sequence: Page[] }>('site-data', 'page-sequence');
      if (data) {
        if ('activePages' in data) {
          setSequence(data as PageSequence);
        } else if ('sequence' in data) {
          // Convert old format to new format
          const activePages = data.sequence;
          const hiddenPages = ALL_PAGES.filter(p => !activePages.includes(p));
          setSequence({ activePages, hiddenPages });
        }
      } else {
        setSequence({ activePages: ALL_PAGES, hiddenPages: [] });
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
