import { getPortfolioData } from '@/lib/placeholder-data';
import { SkillsForm } from './components';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function SkillsPage() {
  const portfolioData = await getPortfolioData();

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Manage Skills</CardTitle>
          <CardDescription>
            Add, edit, or remove the skills that appear on your portfolio.
          </CardDescription>
        </CardHeader>
      </Card>
      <SkillsForm data={portfolioData.skills} />
    </div>
  );
}
