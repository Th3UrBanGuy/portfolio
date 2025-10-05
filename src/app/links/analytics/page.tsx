'use client';

import { Suspense } from 'react';
import AnalyticsClientPage from './AnalyticsClientPage';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

function AnalyticsLoadingSkeleton() {
    return (
        <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className='flex items-center gap-4'>
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-8 w-40" />
                    </div>
                    <Skeleton className="h-10 w-[280px]" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-3">
                        <CardHeader><Skeleton className='h-6 w-1/4' /></CardHeader>
                        <CardContent><Skeleton className="h-10 w-1/2" /></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><Skeleton className='h-6 w-1/2' /></CardHeader>
                        <CardContent><Skeleton className="h-48 w-full" /></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><Skeleton className='h-6 w-1/2' /></CardHeader>
                        <CardContent><Skeleton className="h-48 w-full" /></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><Skeleton className='h-6 w-1/2' /></CardHeader>
                        <CardContent><Skeleton className="h-48 w-full" /></CardContent>
                    </Card>
                    <Card className="lg:col-span-3">
                        <CardHeader><Skeleton className='h-6 w-1/3' /></CardHeader>
                        <CardContent><Skeleton className="h-64 w-full" /></CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsLoadingSkeleton />}>
      <AnalyticsClientPage />
    </Suspense>
  );
}
