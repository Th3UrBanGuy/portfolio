'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

const getTitleFromPath = (path: string) => {
  if (path.startsWith('/admin/viewers')) return 'Viewers';
  if (path === '/admin') return 'Dashboard';
  const parts = path.split('/').pop()?.split('-') || [];
  return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
};

export default function Header() {
  const pathname = usePathname();
  const title = getTitleFromPath(pathname);

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
    </header>
  );
}

    