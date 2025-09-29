import { getCollectionData } from '@/lib/placeholder-data';
import { ExperienceForm } from './components';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Experience } from '@/lib/types';

export default async function ExperiencePage() {
  const experience = await getCollectionData<Experience>('experience', 'order');

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
      <ExperienceForm data={experience} />
    </div>
  );
}
