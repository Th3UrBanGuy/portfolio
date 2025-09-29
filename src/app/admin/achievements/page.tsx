import { getPortfolioData } from '@/lib/placeholder-data';
import { AchievementsForm } from './components';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function AchievementsPage() {
  const portfolioData = await getPortfolioData();

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Manage Achievements</CardTitle>
          <CardDescription>
            Add, edit, or remove the awards, publications, and other achievements that appear on your portfolio.
          </CardDescription>
        </CardHeader>
      </Card>
      <AchievementsForm data={portfolioData.achievements} />
    </div>
  );
}
