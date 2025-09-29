'use client';

import { useState, useOptimistic, useTransition } from 'react';
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
import { updateSkills } from './actions';

type ContentViewProps = {
    initialSkills: Skill[];
    initialCategories: string[];
}

export function ContentView({ initialSkills, initialCategories }: ContentViewProps) {
    const [view, setView] = useState<'skills' | 'categories'>('skills');
    const [isPending, startTransition] = useTransition();

    const [optimisticSkills, setOptimisticSkills] = useOptimistic(
        initialSkills,
        (state, newSkills: Skill[]) => newSkills
    );

    const [optimisticCategories, setOptimisticCategories] = useOptimistic(
        initialCategories,
        (state, newCategories: string[]) => newCategories
    );

    const handleSave = async (data: { skills: Skill[] }) => {
        const newCategories = [...new Set(data.skills.map(s => s.category))];
        
        startTransition(() => {
            setOptimisticSkills(data.skills);
            setOptimisticCategories(newCategories);
        });
        
        return await updateSkills(data.skills);
    };


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
                        <SkillsForm 
                            skills={optimisticSkills} 
                            categories={optimisticCategories} 
                            onSave={handleSave} 
                        />
                    </CardContent>
                </Card>
            )}

            {view === 'categories' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Categories</CardTitle>
                        <CardDescription>
                            Categories are managed automatically based on the skills you create.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CategoryManager categories={optimisticCategories} />
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
