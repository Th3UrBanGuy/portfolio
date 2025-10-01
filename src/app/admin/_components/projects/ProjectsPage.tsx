'use client';

import { useState, useEffect } from 'react';
import { getPortfolioData, getDocumentData } from '@/lib/placeholder-data';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ContentView } from '@/app/admin/projects/content-view';
import { TitleForm } from '@/app/admin/projects/components/TitleForm';
import type { Project, PageTitle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type AdminView = 'dashboard' | 'profile' | 'education' | 'skills' | 'experience' | 'achievements' | 'projects' | 'contact' | 'security';

type ProjectsPageProps = {
  setActiveView: (view: AdminView) => void;
};

export default function ProjectsPage({ setActiveView }: ProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [bundles, setBundles] = useState<string[]>([]);
  const [titles, setTitles] = useState({ pageTitle: '', tocTitle: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [portfolioData, titleData] = await Promise.all([
        getPortfolioData(),
        getDocumentData<PageTitle>('page-titles', 'projects'),
      ]);
      const projectData = portfolioData.projects as Project[] || [];
      const bundleData = [...new Set(projectData.map(p => p.category))];
      setProjects(projectData);
      setBundles(bundleData);
      setTitles({
        pageTitle: titleData?.pageTitle ?? 'Projects',
        tocTitle: titleData?.tocTitle ?? 'Projects',
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
                    <CardTitle>Manage Projects &amp; Bundles</CardTitle>
                    <CardDescription>
                        Organize your projects and the bundles they belong to.
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
                <ContentView projects={projects} bundles={bundles} />
            </>
        )}
    </div>
  );
}