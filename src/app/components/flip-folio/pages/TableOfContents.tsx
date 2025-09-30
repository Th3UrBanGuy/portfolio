'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Page, pageConfig } from '@/lib/types';


type TableOfContentsProps = {
  onNavigate: (page: Page) => void;
  isStaticPanel?: boolean;
  pageSequence: Page[];
};

export default function TableOfContents({ onNavigate, isStaticPanel = false, pageSequence }: TableOfContentsProps) {

  // Filter out fixed or non-navigable pages
  const navItems = pageSequence
    .map(pageId => pageConfig[pageId])
    .filter(config => config && config.isNavigable);

  return (
    <div className={cn(
      "flex h-full flex-col justify-center",
      isStaticPanel ? "items-start pt-16" : "items-center text-center"
    )}>
       <div className={cn(
         "flex flex-col mb-8",
         isStaticPanel ? "items-start text-left" : "items-center text-center"
       )}>
          <div className="flex items-center gap-3">
            {pageConfig.toc.icon({className: "h-8 w-8 text-primary"})}
            <h1 className="font-headline text-xl text-page-foreground">
                {pageConfig.toc.label}
            </h1>
          </div>
          <p className="text-page-foreground/80 mt-2 text-sm">Table of Contents</p>
       </div>
      
      <nav className={cn(isStaticPanel ? "w-full" : "w-64")}>
        <ul className="space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-12 px-4 bg-transparent border-stone-400/50 text-page-foreground hover:bg-black/5 hover:border-primary"
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon className="mr-4 h-5 w-5 text-primary" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  );
}
