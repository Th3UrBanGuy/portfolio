'use client';

import { useState, useEffect } from 'react';
import { getDocumentData } from '@/lib/placeholder-data';
import { SecurityForm } from '@/app/admin/security/components';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type AdminView = 'dashboard' | 'profile' | 'education' | 'skills' | 'experience' | 'achievements' | 'projects' | 'contact' | 'security';

type SecurityPageProps = {
  setActiveView: (view: AdminView) => void;
};

export default function SecurityPage({ setActiveView }: SecurityPageProps) {
  const [currentKey, setCurrentKey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const authData = await getDocumentData<{ key: string }>('site-data', 'admin-auth');
      setCurrentKey(authData?.key ?? '');
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Manage Security</CardTitle>
                <CardDescription>
                    Update the secret key used to access the admin panel.
                </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={() => setActiveView('dashboard')}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
        </CardHeader>
      </Card>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <SecurityForm currentKey={currentKey} />
      )}
    </div>
  );
}
