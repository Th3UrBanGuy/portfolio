'use client';

import { useState, useEffect } from 'react';
import { getCollectionData, getDocumentData } from '@/lib/placeholder-data';
import { AchievementsForm } from '@/app/admin/achievements/components';
import { TitleForm } from '@/app/admin/achievements/components/TitleForm';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Achievement, PageTitle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type AdminView = 'dashboard' | 'profile' | 'education' | 'skills' | 'experience' | 'achievements' | 'projects' | 'contact' | 'security';

type AchievementsPageProps = {
  setActiveView: (view: AdminView) => void;
};

export default function AchievementsPage({ setActiveView }: AchievementsPageProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [achievementsData, titleData] = await Promise.all([
        getCollectionData<Achievement>('achievements', 'order'),
        getDocumentData<PageTitle>('page-titles', 'achievements'),
      ]);
      setAchievements(achievementsData);
      setTitle(titleData?.title ?? 'Achievements');
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Manage Achievements</CardTitle>
                <CardDescription>
                    Add, edit, or remove the awards, publications, and other achievements that appear on your portfolio.
                </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={() => setActiveView('dashboard')}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
        </CardHeader>
      </Card>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <>
            <TitleForm title={title} />
            <AchievementsForm data={achievements} />
        </>
      )}
    </div>
  );
}