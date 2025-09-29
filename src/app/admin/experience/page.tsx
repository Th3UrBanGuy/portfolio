import { getPortfolioData } from '@/lib/placeholder-data';
import { ExperienceForm } from './components';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function ExperiencePage() {
  const portfolioData = await getPortfolioData();

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Manage Experience</CardTitle>
          <CardDescription>
            Add, edit, or remove the professional experiences that appear on your portfolio.
          </CardDescription>
        </CardHeader>
      </Card>
      <ExperienceForm data={portfolioData.experience} />
    </div>
  );
}
