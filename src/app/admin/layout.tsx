'use client';

import Link from 'next/link';
import { Book } from 'lucide-react';
import Header from './_components/Header';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="p-4 md:p-6">
        <Header />
        <main className="mt-4">{children}</main>
        <div className="mt-8 text-center">
            <Button asChild variant="outline">
                <Link href="/">
                    <Book className="mr-2 h-4 w-4" />
                    View Portfolio
                </Link>
            </Button>
        </div>
      </div>
  );
}
