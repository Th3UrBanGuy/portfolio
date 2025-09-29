import { getDocumentData } from '@/lib/placeholder-data';
import { SecurityForm } from './components';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function SecurityPage() {
  const authData = await getDocumentData<{ key: string }>('site-data', 'admin-auth');

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Manage Security</CardTitle>
          <CardDescription>
            Update the secret key used to access the admin panel.
          </CardDescription>
        </CardHeader>
      </Card>
      <SecurityForm currentKey={authData?.key ?? ''} />
    </div>
  );
}
