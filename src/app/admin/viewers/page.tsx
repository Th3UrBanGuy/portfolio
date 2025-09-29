import { getViewers } from '@/lib/services/viewers';
import { ViewerList } from './components';

export default async function ViewersPage() {
  const viewers = await getViewers();
  
  return (
    <div className="space-y-6">
      <ViewerList viewers={viewers} />
    </div>
  );
}
