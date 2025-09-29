'use client';

import { useState, useEffect } from 'react';
import { getCollectionData, getDocumentData } from '@/lib/placeholder-data';
import { ExperienceForm } from '@/app/admin/experience/components';
import { TitleForm } from '@/app/admin/experience/components/TitleForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Experience, PageTitle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type AdminView = 'dashboard' | 'profile' | 'education' | 'skills' | 'experience' | 'achievements' | 'projects' | 'contact' | 'security';

type ExperiencePageProps = {
  setActiveView: (view: AdminView) => void;
};

export default function ExperiencePage({ setActiveView }: ExperiencePageProps) {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [experienceData, titleData] = await Promise.all([
        getCollectionData<Experience>('experience', 'order'),
        getDocumentData<PageTitle>('page-titles', 'experience'),
      ]);
      setExperience(experienceData);
      setTitle(titleData?.title ?? 'Experience');
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Manage Experience</CardTitle>
                <CardDescription>
                    Add, edit, or remove the professional experiences that appear on your portfolio.
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
            <ExperienceForm data={experience} />
        </>
      )}
    </div>
  );
}