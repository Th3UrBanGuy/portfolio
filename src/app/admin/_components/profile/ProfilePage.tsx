'use client';

import { useState, useEffect } from 'react';
import { getPortfolioData, getDocumentData } from '@/lib/placeholder-data';
import { ProfileForm } from '@/app/admin/profile/components';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PortfolioData, PageTitle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { TitleForm } from '@/app/admin/profile/components/TitleForm';


type AdminView = 'dashboard' | 'profile' | 'education' | 'skills' | 'experience' | 'achievements' | 'projects' | 'contact' | 'security';

type ProfilePageProps = {
  setActiveView: (view: AdminView) => void;
};

export default function ProfilePage({ setActiveView }: ProfilePageProps) {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [titles, setTitles] = useState({ pageTitle: '', tocTitle: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [data, titleData] = await Promise.all([
        getPortfolioData(),
        getDocumentData<PageTitle>('page-titles', 'profile'),
      ]);
      setPortfolioData(data);
      setTitles({
        pageTitle: titleData?.pageTitle ?? 'Profile',
        tocTitle: titleData?.tocTitle ?? 'Profile',
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
                <CardTitle>Manage Profile</CardTitle>
                <CardDescription>
                    Update your personal information, bio, and other details that appear on your portfolio's "About Me" page.
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
            <TitleForm pageTitle={titles.pageTitle} tocTitle={titles.tocTitle} />
            <ProfileForm data={portfolioData!} />
        </>
      )}
    </div>
  );
}
