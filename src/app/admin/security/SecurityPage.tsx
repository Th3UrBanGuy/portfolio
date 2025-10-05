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
  const [adminKey, setAdminKey] = useState('');
  const [linkShortenerKey, setLinkShortenerKey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [adminAuthData, linkAuthData] = await Promise.all([
        getDocumentData<{ key: string }>('site-data', 'admin-auth'),
        getDocumentData<{ key: string }>('site-data', 'link-auth')
      ]);
      
      setAdminKey(adminAuthData?.key ?? '');
      setLinkShortenerKey(linkAuthData?.key ?? '');
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
                    Update access credentials for the admin panel and URL shortener.
                </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={() => setActiveView('dashboard')}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
        </CardHeader>
      </Card>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <SecurityForm currentAdminKey={adminKey} currentLinkShortenerKey={linkShortenerKey} />
      )}
    </div>
  );
}
