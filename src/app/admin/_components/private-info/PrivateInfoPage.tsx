'use client';

import { useState, useEffect } from 'react';
import { TitleForm } from '@/app/admin/private-info/components/TitleForm';
import { PrivateInfo, PageTitle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getDocumentData } from '@/lib/placeholder-data';
import EditPrivateInfoForm from './EditPrivateInfoForm';

type AdminView = 'dashboard' | 'profile' | 'education' | 'skills' | 'experience' | 'achievements' | 'projects' | 'contact' | 'security' | 'private-info';

type PrivateInfoPageProps = {
  setActiveView: (view: AdminView) => void;
};

export default function PrivateInfoPage({ setActiveView }: PrivateInfoPageProps) {
  const [privateInfo, setPrivateInfo] = useState<PrivateInfo | null>(null);
  const [titles, setTitles] = useState({ pageTitle: '', tocTitle: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [privateInfoData, titleData] = await Promise.all([
        getDocumentData<PrivateInfo>('site-data', 'private-info'),
        getDocumentData<PageTitle>('page-titles', 'private-info'),
      ]);
      setPrivateInfo(privateInfoData);
      setTitles({
        pageTitle: titleData?.pageTitle ?? 'Private Info',
        tocTitle: titleData?.tocTitle ?? 'Private Info',
      });
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Manage Private Information</CardTitle>
                <CardDescription>
                    Edit the private information section of your portfolio.
                </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={() => setActiveView('dashboard')}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
        </CardHeader>
      </Card>
      {loading || !privateInfo ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <>
            <TitleForm pageTitle={titles.pageTitle} tocTitle={titles.tocTitle} />
            <EditPrivateInfoForm initialData={privateInfo} />
        </>
      )}
    </div>
  );
}
