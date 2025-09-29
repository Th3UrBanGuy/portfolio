'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const getTitleFromPath = (path: string) => {
  if (path === '/admin') return 'Dashboard';
  if (path.startsWith('/admin/viewers')) return 'Viewers';
  if (path.startsWith('/admin/profile')) return 'Profile';
  if (path.startsWith('/admin/education')) return 'Education';
  if (path.startsWith('/admin/skills')) return 'Skills';
  if (path.startsWith('/admin/experience')) return 'Experience';
  const parts = path.split('/').pop()?.split('-') || [];
  return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
};

export default function Header() {
  const pathname = usePathname();
  const title = getTitleFromPath(pathname);
  const isDashboard = pathname === '/admin';

  return (
    <header className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center gap-4">
        {!isDashboard && (
             <Button asChild variant="outline" size="icon">
                <Link href="/admin">
                    <Home />
                    <span className="sr-only">Dashboard</span>
                </Link>
            </Button>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
    </header>
  );
}
