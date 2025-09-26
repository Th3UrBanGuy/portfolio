'use client';

import React, { useState } from 'react';
import type { PortfolioData, Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, Menu } from 'lucide-react';
import CoverPage from './pages/CoverPage';
import TableOfContents from './pages/TableOfContents';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import ProjectDetailDialog from './ProjectDetailDialog';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

type Page = 'cover' | 'toc' | 'about' | 'projects' | 'contact';

const pageOrder: Page[] = ['cover', 'toc', 'about', 'projects', 'contact'];

export default function Flipbook({ data }: { data: PortfolioData }) {
  const [currentPage, setCurrentPage] = useState<Page>('cover');
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPageIndex = pageOrder.indexOf(currentPage);
  const totalPages = pageOrder.length;

  const navigate = (page: Page) => {
    if (isFlipping) return;
    const newIndex = pageOrder.indexOf(page);
    if (newIndex === currentPageIndex) return;

    setIsFlipping(true);
    setDirection(newIndex > currentPageIndex ? 'next' : 'prev');
    setMobileMenuOpen(false);

    setTimeout(() => {
      setCurrentPage(page);
      setIsFlipping(false);
    }, 600);
  };

  const nextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      navigate(pageOrder[currentPageIndex + 1]);
    }
  };

  const prevPage = () => {
    if (currentPageIndex > 0) {
      navigate(pageOrder[currentPageIndex - 1]);
    }
  };

  const renderPageContent = (page: Page) => {
    switch (page) {
      case 'cover':
        return <CoverPage onOpen={() => navigate('toc')} />;
      case 'toc':
        return <TableOfContents onNavigate={navigate} />;
      case 'about':
        return <AboutPage content={data.aboutMe} />;
      case 'projects':
        return <ProjectsPage projects={data.projects} onProjectSelect={setSelectedProject} />;
      case 'contact':
        return <ContactPage />;
      default:
        return null;
    }
  };
  
  const getPageClass = (page: 'left' | 'right') => {
    const isCover = currentPage === 'cover';
    const isContact = currentPage === 'contact';

    if (isFlipping) {
        if (direction === 'next') {
            return page === 'left' ? 'animate-flip-out-next' : 'animate-flip-in-next';
        }
        if (direction === 'prev') {
            return page === 'left' ? 'animate-flip-in-prev' : 'animate-flip-out-prev';
        }
    }
    
    return 'transform-none';
  }

  return (
    <main className="flex h-screen w-full items-center justify-center bg-background p-4 overflow-hidden">
        {/* Mobile Header */}
       <header className="fixed top-0 left-0 right-0 z-50 flex md:hidden items-center justify-between p-4 bg-background/80 backdrop-blur-sm">
         <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon"><Menu /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="glass">
             <TableOfContents onNavigate={navigate} isStaticPanel={true} />
          </SheetContent>
         </Sheet>
         <div className="text-sm font-medium">
          {currentPageIndex > 0 ? `${currentPageIndex} / ${totalPages - 1}` : 'Cover'}
         </div>
         <div className="w-10"></div>
       </header>

      <div className="relative w-full h-full flex items-center justify-center perspective">
        <div className={cn("relative w-full max-w-[90vw] md:max-w-6xl aspect-[4/3] md:aspect-[2/1.3] preserve-3d transition-transform duration-500 ease-in-out", currentPage === 'cover' && 'md:group-hover:rotate-y-2')}>
            {/* Left Page (Back of previous page) */}
            <div className={cn(
              "absolute w-1/2 h-full left-0 top-0 bg-card rounded-l-lg shadow-xl preserve-3d origin-right border-r border-border/50 glass",
               currentPage === 'cover' ? 'hidden' : 'block',
               getPageClass('left')
            )}>
              <div className="absolute inset-0 p-8 backface-hidden">
                {currentPageIndex > 1 && renderPageContent(pageOrder[currentPageIndex - 1])}
              </div>
            </div>

            {/* Right Page (Current Page) */}
            <div className={cn(
                "absolute w-1/2 h-full right-0 top-0 bg-card rounded-r-lg shadow-2xl preserve-3d origin-left glass",
                currentPage === 'cover' && 'w-full rounded-lg',
                getPageClass('right')
            )}>
                <div className="absolute inset-0 p-8 backface-hidden">
                    {renderPageContent(currentPage)}
                </div>
            </div>

             {/* Book Spine */}
            <div className={cn("hidden md:block absolute w-8 h-full top-0 left-1/2 -translate-x-1/2 bg-neutral-900/80 shadow-inner-lg transform -rotate-y-90 origin-center preserve-3d", currentPage==='cover' ? 'opacity-0' : 'opacity-100')}>
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-neutral-700 via-neutral-900 to-neutral-700"></div>
            </div>
        </div>
      </div>


      {/* Desktop & Mobile Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        <Button onClick={prevPage} disabled={currentPageIndex === 0 || isFlipping} variant="outline" size="icon" className="rounded-full glass">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button onClick={() => navigate('toc')} variant="ghost" size="icon" disabled={isFlipping || currentPage === 'toc'} className="rounded-full hover:bg-primary/10 glass">
          <Home className="h-4 w-4" />
        </Button>
        <Button onClick={nextPage} disabled={currentPageIndex === totalPages - 1 || isFlipping} variant="outline" size="icon" className="rounded-full glass">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <ProjectDetailDialog project={selectedProject} open={!!selectedProject} onOpenChange={() => setSelectedProject(null)} />
    </main>
  );
}
