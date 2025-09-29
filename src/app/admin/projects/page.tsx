import { getPortfolioData } from '@/lib/placeholder-data';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ContentView } from './content-view';
import type { Project } from '@/lib/types';


export default async function ProjectsPage() {
    const portfolioData = await getPortfolioData();

    const projectsForForm = portfolioData.projects as Project[];
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
            </Card>
            <ContentView projects={projectsForForm} bundles={bundles} />
        </div>
    );
}
