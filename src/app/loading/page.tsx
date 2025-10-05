'use client';

import { Suspense } from 'react';
import LoadingClientPage from './LoadingClientPage';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingScreenSkeleton() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="w-full max-w-xl text-center">
                <div className="relative inline-block mb-8">
                    <Skeleton className="w-40 h-40 rounded-full" />
                </div>
                <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
                <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
        </div>
    );
}

export default function LoadingPage() {
  return (
    <Suspense fallback={<LoadingScreenSkeleton />}>
      <LoadingClientPage />
    </Suspense>
  );
}
