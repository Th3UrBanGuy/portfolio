'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProjectsForm, BundleManager } from './components';
import { FolderKanban, ListTree } from 'lucide-react';
import type { Project, ProjectBundle } from '@/lib/types';
import { updateProjects } from './actions';

export function ContentView({ projects, bundles }: { projects: Project[], bundles: ProjectBundle[] }) {
    const [view, setView] = useState<'projects' | 'bundles'>('projects');

    const handleSaveProjects = async (data: Project[]) => {
        return await updateProjects(data);
    };

    return (
        <div className="space-y-6">
            <Card>
                 <CardHeader>
                    <CardTitle>Choose an action</CardTitle>
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
                        <ProjectsForm data={projects} bundles={bundles} onSave={handleSaveProjects} />
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
                        <BundleManager initialBundles={bundles} />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
