'use client';

import { useState, useEffect } from 'react';
import { getPortfolioData } from '@/lib/placeholder-data';
import { ProjectsForm, BundleManager } from './components';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderKanban, ListTree } from 'lucide-react';
import type { Project } from '@/lib/types';

// We have to do this weird dance because we can't use async components in a client component.
const mapProjectsToFormData = (projects: Project[]) => {
  return projects.map(p => ({
    id: p.id,
    title: p.name,
    short_description: p.description,
    image_url: p.imageUrl,
    full_description: p.full_description,
    technologies: p.technologies,
    preview_link: p.preview_link,
    documentation_link: p.documentation_link,
    category: p.category,
  }));
}

type MappedProject = ReturnType<typeof mapProjectsToFormData>[0];

export default function ProjectsPage() {
    const [portfolioData, setPortfolioData] = useState<Awaited<ReturnType<typeof getPortfolioData>> | null>(null);
    const [view, setView] = useState<'projects' | 'bundles'>('projects');

    useEffect(() => {
        getPortfolioData().then(data => setPortfolioData(data));
    }, []);

    if (!portfolioData) {
        return (
             <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Projects</CardTitle>
                        <CardDescription>
                            Add, edit, or remove the projects and project bundles that appear on your portfolio.
                        </CardDescription>
                    </CardHeader>
                </Card>
                <p>Loading...</p>
            </div>
        )
    }

    const projectsForForm = mapProjectsToFormData(portfolioData.projects);
    const bundles = [...new Set(portfolioData.projects.map(p => p.category))];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Projects &amp; Bundles</CardTitle>
                    <CardDescription>
                        Organize your projects and the bundles they belong to.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4">
                    <Button onClick={() => setView('projects')} variant={view === 'projects' ? 'default' : 'outline'} className="flex-1">
                        <FolderKanban className="mr-2" />
                        Project Management
                    </Button>
                    <Button onClick={() => setView('bundles')} variant={view === 'bundles' ? 'default' : 'outline'} className="flex-1">
                        <ListTree className="mr-2" />
                        Bundle Management
                    </Button>
                </CardContent>
            </Card>

            {view === 'projects' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Projects</CardTitle>
                        <CardDescription>
                            Add, edit, or remove the projects that appear on your portfolio.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProjectsForm data={projectsForForm} bundles={bundles} />
                    </CardContent>
                </Card>
            )}

            {view === 'bundles' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Bundles</CardTitle>
                        <CardDescription>
                            Add or remove the bundles used to group your projects.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BundleManager bundles={bundles} />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
