import { getCollectionData } from '@/lib/placeholder-data';
import { AchievementsForm } from './components';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Achievement } from '@/lib/types';

export default async function AchievementsPage() {
  const achievements = await getCollectionData<Achievement>('achievements', 'order');

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
      <AchievementsForm data={achievements} />
    </div>
  );
}
