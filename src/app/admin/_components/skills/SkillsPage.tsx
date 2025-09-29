'use client';

import { useState, useEffect } from 'react';
import { getPortfolioData, getDocumentData } from '@/lib/placeholder-data';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ContentView } from '@/app/admin/skills/content-view';
import { TitleForm } from '@/app/admin/skills/components/TitleForm';
import { Skill, PageTitle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type AdminView = 'dashboard' | 'profile' | 'education' | 'skills' | 'experience' | 'achievements' | 'projects' | 'contact' | 'security';

type SkillsPageProps = {
  setActiveView: (view: AdminView) => void;
};

export default function SkillsPage({ setActiveView }: SkillsPageProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [portfolioData, titleData] = await Promise.all([
        getPortfolioData(),
        getDocumentData<PageTitle>('page-titles', 'skills'),
      ]);
      const skillData = portfolioData.skills || [];
      const categoryData = [...new Set(skillData.map(s => s.category))];
      setSkills(skillData);
      setCategories(categoryData);
      setTitle(titleData?.title ?? 'Skills');
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manage Skills &amp; Categories</CardTitle>
                    <CardDescription>
                        Organize your skills and the categories they belong to.
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
                <ContentView initialSkills={skills} initialCategories={categories} />
            </>
        )}
    </div>
  );
}