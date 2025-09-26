'use client';

import { Button } from '@/components/ui/button';
import { User, Briefcase, Mail, BookOpenCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type Page = 'cover' | 'toc' | 'about' | 'projects' | 'contact';

type TableOfContentsProps = {
  onNavigate: (page: Page) => void;
  isStaticPanel?: boolean;
};

const navItems = [
  { page: 'about' as Page, label: 'About Me', icon: User },
  { page: 'projects' as Page, label: 'Projects', icon: Briefcase },
  { page: 'contact' as Page, label: 'Contact', icon: Mail },
];

export default function TableOfContents({ onNavigate, isStaticPanel = false }: TableOfContentsProps) {
  return (
    <div className={cn(
      "flex h-full flex-col justify-center",
      isStaticPanel ? "items-start pt-16" : "items-center text-center"
    )}>
       <div className={cn(
         "flex flex-col mb-10",
         isStaticPanel ? "items-start text-left" : "items-center text-center"
       )}>
          <div className="flex items-center gap-3">
            <BookOpenCheck className="h-10 w-10 text-primary" />
            <h1 className="font-headline text-3xl font-bold tracking-tight">
                FlipFolio
            </h1>
          </div>
          <p className="text-muted-foreground mt-2">An Interactive Portfolio</p>
       </div>
      
      <nav className={cn(isStaticPanel ? "w-full" : "w-64")}>
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.page}>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-14 px-6 text-base glass"
                onClick={() => onNavigate(item.page)}
              >
                <item.icon className="mr-4 h-5 w-5 text-primary" />
                <span>{item.label}</span>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
