import { getPortfolioData } from '@/lib/placeholder-data';
import { ProfileForm } from './components';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function ProfilePage() {
  const portfolioData = await getPortfolioData();

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Manage Profile</CardTitle>
          <CardDescription>
            Update your personal information, bio, and other details that appear on your portfolio's "About Me" page.
          </CardDescription>
        </CardHeader>
      </Card>
      <ProfileForm data={portfolioData} />
    </div>
  );
}
