import { getCollectionData } from '@/lib/placeholder-data';
import { EducationForm } from './components';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Education } from '@/lib/types';

export default async function EducationPage() {
  const education = await getCollectionData<Education>('education', 'order');

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Manage Education</CardTitle>
          <CardDescription>
            Add, edit, or remove the educational institutions that appear on your portfolio.
          </CardDescription>
        </CardHeader>
      </Card>
      <EducationForm data={education} />
    </div>
  );
}
