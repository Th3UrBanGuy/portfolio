'use client';

import { useState, useEffect } from 'react';
import { getCollectionData, getDocumentData } from '@/lib/placeholder-data';
import { EducationForm } from '@/app/admin/education/components';
import { TitleForm } from '@/app/admin/education/components/TitleForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Education, PageTitle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type AdminView = 'dashboard' | 'profile' | 'education' | 'skills' | 'experience' | 'achievements' | 'projects' | 'contact' | 'security';

type EducationPageProps = {
  setActiveView: (view: AdminView) => void;
};

export default function EducationPage({ setActiveView }: EducationPageProps) {
  const [education, setEducation] = useState<Education[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [educationData, titleData] = await Promise.all([
        getCollectionData<Education>('education', 'order'),
        getDocumentData<PageTitle>('page-titles', 'education'),
      ]);
      setEducation(educationData);
      setTitle(titleData?.title ?? 'Education');
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Manage Education</CardTitle>
                <CardDescription>
                    Add, edit, or remove the educational institutions that appear on your portfolio.
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
            <EducationForm data={education} />
        </>
      )}
    </div>
  );
}
