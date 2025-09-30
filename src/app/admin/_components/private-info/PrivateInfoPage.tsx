'use client';

import { useState, useEffect } from 'react';
import { getDocumentData } from '@/lib/placeholder-data';
import { PrivateInfoForm } from '@/app/admin/private-info/components';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { PrivateInfo } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type AdminView = 'dashboard' | 'profile' | 'private-info' | 'education' | 'skills' | 'experience' | 'achievements' | 'projects' | 'contact' | 'security';

type PrivateInfoPageProps = {
  setActiveView: (view: AdminView) => void;
};

export default function PrivateInfoPage({ setActiveView }: PrivateInfoPageProps) {
  const [privateInfo, setPrivateInfo] = useState<PrivateInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getDocumentData<PrivateInfo>('site-data', 'private-info');
      setPrivateInfo(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Manage Private Information</CardTitle>
                <CardDescription>
                    Update your sensitive personal information and private documents.
                </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={() => setActiveView('dashboard')}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
        </CardHeader>
      </Card>
      {loading || !privateInfo ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <PrivateInfoForm data={privateInfo} />
      )}
    </div>
  );
}
