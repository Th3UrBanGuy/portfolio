'use client';

import { useState, useEffect } from 'react';
import { getPortfolioData } from '@/lib/placeholder-data';
import { SkillsForm, CategoryManager } from './components';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListTree, Star } from 'lucide-react';
import type { Skill } from '@/lib/types';

// We have to do this weird dance because we can't use async components in a client component.
// We pass the data as a prop instead.
export default function SkillsPage() {
    const [portfolioData, setPortfolioData] = useState<Awaited<ReturnType<typeof getPortfolioData>> | null>(null);

    useEffect(() => {
        getPortfolioData().then(data => setPortfolioData(data));
    }, []);

    if (!portfolioData) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Skills</CardTitle>
                        <CardDescription>
                            Organize your skills and the categories they belong to.
                        </CardDescription>
                    </CardHeader>
                </Card>
                <p>Loading...</p>
            </div>
        )
    }
  
  const categories = [...new Set(portfolioData.skills.map(s => s.category))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Skills</CardTitle>
          <CardDescription>
            Organize your skills and the categories they belong to.
          </CardDescription>
        </CardHeader>
      </Card>
      <ContentView skills={portfolioData.skills} categories={categories} />
    </div>
  );
}

function ContentView({ skills, categories }: { skills: Skill[], categories: string[] }) {
    const [view, setView] = useState<'skills' | 'categories'>('skills');

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Choose an action</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4">
                    <Button onClick={() => setView('skills')} variant={view === 'skills' ? 'default' : 'outline'} className="flex-1">
                        <Star className="mr-2" />
                        Skill Management
                    </Button>
                    <Button onClick={() => setView('categories')} variant={view === 'categories' ? 'default' : 'outline'} className="flex-1">
                        <ListTree className="mr-2" />
                        Category Management
                    </Button>
                </CardContent>
            </Card>

            {view === 'skills' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Skills</CardTitle>
                        <CardDescription>
                            Add, edit, or remove the skills that appear on your portfolio.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SkillsForm data={skills} categories={categories} />
                    </CardContent>
                </Card>
            )}

            {view === 'categories' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Categories</CardTitle>
                        <CardDescription>
                            Add or remove the categories used to group your skills.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CategoryManager categories={categories} />
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
