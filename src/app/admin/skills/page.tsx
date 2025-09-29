import { getPortfolioData } from '@/lib/placeholder-data';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ContentView } from './content-view';


export default async function SkillsPage() {
    const portfolioData = await getPortfolioData();
  
    const categories = [...new Set(portfolioData.skills.map(s => s.category))];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Skills &amp; Categories</CardTitle>
                    <CardDescription>
                        Organize your skills and the categories they belong to.
                    </CardDescription>
                </CardHeader>
            </Card>
            <ContentView skills={portfolioData.skills} categories={categories} />
        </div>
    );
}
