'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

const getTitleFromPath = (path: string) => {
  if (path === '/admin') return 'Dashboard';
  const parts = path.split('/').pop()?.split('-') || [];
  return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
};

const getAddLinkFromPath = (path: string) => {
    if(path.includes('personal-info') || path.includes('contact')) return null;

    if (path === '/admin') return null;
    const base = path.split('/')[2];
    if (!base) return null;
    return `/admin/${base}/new`;
}


export default function Header() {
  const pathname = usePathname();
  const title = getTitleFromPath(pathname);
  const addLink = getAddLinkFromPath(pathname);

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-2xl font-semibold">{title}</h1>
      </div>
      {addLink && (
        <Button asChild>
            <Link href={addLink}><PlusCircle className="mr-2 h-4 w-4" /> Add New</Link>
        </Button>
      )}
    </header>
  );
}
