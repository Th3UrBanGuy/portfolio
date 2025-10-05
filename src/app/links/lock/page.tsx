'use client';
import { Suspense } from 'react';
import LockClientPage from './LockClientPage';
import { Skeleton } from '@/components/ui/skeleton';

function LockPageSkeleton() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-md rounded-lg bg-gray-800/30 p-8">
                <div className="text-center mb-6">
                    <Skeleton className="mx-auto h-16 w-16 rounded-full" />
                    <Skeleton className="h-8 w-3/4 mx-auto mt-4" />
                    <Skeleton className="h-4 w-full mx-auto mt-2" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    );
}

export default function LockPage() {
  return (
    <Suspense fallback={<LockPageSkeleton />}>
      <LockClientPage />
    </Suspense>
  );
}
