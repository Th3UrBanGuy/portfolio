import { getPortfolioData } from '@/lib/placeholder-data';
import { SkillsForm, CategoryManager } from './components';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListTree, Star } from 'lucide-react';

export default async function SkillsPage() {
  const portfolioData = await getPortfolioData();
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

      <Tabs defaultValue="skills">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="skills">
            <Star className='mr-2' />
            Skill Management
            </TabsTrigger>
          <TabsTrigger value="categories">
            <ListTree className='mr-2' />
            Category Management
            </TabsTrigger>
        </TabsList>
        <TabsContent value="skills" className="mt-6">
           <Card>
            <CardHeader>
              <CardTitle>Edit Skills</CardTitle>
              <CardDescription>
                Add, edit, or remove the skills that appear on your portfolio.
              </CardDescription>
            </CardHeader>
             <CardContent>
                <SkillsForm data={portfolioData.skills} categories={categories} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories" className="mt-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
