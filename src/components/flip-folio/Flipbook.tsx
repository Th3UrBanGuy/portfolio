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
import { useIsMobile } from '@/hooks/use-mobile';

type Page = 'cover' | 'toc' | 'about' | 'projects' | 'contact';

const pageOrder: Page[] = ['cover', 'toc', 'about', 'projects', 'contact'];

export default function Flipbook({ data }: { data: PortfolioData }) {
  const [currentPage, setCurrentPage] = useState<Page>('cover');
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

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

  const renderPageContent = (page: Page, pageNumber: number) => {
    const pageContent = () => {
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
    }

    return (
        <div className="p-8 md:p-10 h-full w-full bg-page-background text-page-foreground relative overflow-hidden">
            {/* Gutter shadow */}
            <div className={cn(
                "absolute inset-y-0 w-8 pointer-events-none",
                pageNumber % 2 === 0 ? "left-0 bg-gradient-to-r from-black/10 to-transparent" : "right-0 bg-gradient-to-l from-black/10 to-transparent"
            )} />
            
            <div className="relative z-10 h-full w-full">
                {pageContent()}
            </div>
            
            {/* Page Number */}
            {pageNumber > 0 && (
                 <div className={cn(
                    "absolute bottom-4 text-xs text-page-foreground/50 font-sans",
                    pageNumber % 2 === 0 ? "left-6" : "right-6"
                 )}>
                    Page {pageNumber}
                </div>
            )}
        </div>
    )
  };
  
  const getPageClass = (page: 'left' | 'right') => {
    if (isFlipping) {
        if (direction === 'next') {
            // The right page flips out, the left page flips in
            return page === 'right' ? 'animate-flip-out-next' : 'animate-flip-in-next';
        }
        if (direction === 'prev') {
            // The left page flips out, the right page flips in
            return page === 'left' ? 'animate-flip-out-prev' : 'animate-flip-in-prev';
        }
    }
    
    return 'transform-none';
  }

  const getMobilePageClass = () => {
     if (isFlipping) {
        if (direction === 'next') {
          return 'animate-flip-out-next'; // Simplified for mobile
        }
        if (direction === 'prev') {
          return 'animate-flip-out-prev'; // Simplified for mobile
        }
    }
    return 'transform-none';
  }

  if (isMobile) {
    return (
       <main className="flex h-dvh w-full flex-col p-4 pt-20">
         <header className="fixed top-0 left-0 right-0 z-50 flex md:hidden items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
           <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="glass">
               <TableOfContents onNavigate={navigate} isStaticPanel={true} />
            </SheetContent>
           </Sheet>
           <div className="text-sm font-medium uppercase tracking-wider">
            {currentPage === 'cover' ? 'The Arcane Codex' : currentPage}
           </div>
           <Button onClick={() => navigate('toc')} variant="ghost" size="icon" disabled={isFlipping || currentPage === 'toc'} className="rounded-full hover:bg-primary/10">
              <Home className="h-5 w-5" />
            </Button>
         </header>
         
         <div className="relative flex-grow perspective">
            <div className={cn(
                "w-full h-full rounded-lg shadow-2xl preserve-3d origin-center",
                getMobilePageClass()
            )}>
                 <div className="absolute inset-0 backface-hidden rounded-lg overflow-hidden">
                    {renderPageContent(currentPage, currentPageIndex)}
                </div>
                 <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] rounded-lg overflow-hidden">
                    {direction === 'next' && currentPageIndex > 0 && renderPageContent(pageOrder[currentPageIndex - 1], currentPageIndex - 1)}
                    {direction === 'prev' && currentPageIndex < totalPages - 1 && renderPageContent(pageOrder[currentPageIndex + 1], currentPageIndex + 1)}
                </div>
            </div>
         </div>

        <div className="flex-shrink-0 pt-4 flex items-center justify-center gap-4 z-20">
          <Button onClick={prevPage} disabled={currentPageIndex === 0 || isFlipping} variant="outline" size="icon" className="rounded-full glass h-12 w-12">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-sm font-medium text-muted-foreground w-16 text-center">
            {currentPageIndex > 0 ? `${currentPageIndex} / ${totalPages - 1}` : ''}
          </div>
          <Button onClick={nextPage} disabled={currentPageIndex === totalPages - 1 || isFlipping} variant="outline" size="icon" className="rounded-full glass h-12 w-12">
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        <ProjectDetailDialog project={selectedProject} open={!!selectedProject} onOpenChange={() => setSelectedProject(null)} />
      </main>
    )
  }

  return (
    <main className="flex h-screen w-full items-center justify-center bg-background p-4 overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center perspective">
        <div className={cn("relative w-full max-w-6xl aspect-[2/1.4] preserve-3d transition-transform duration-500 ease-in-out", currentPage === 'cover' && 'md:group-hover:rotate-y-2')}>
            
            {/* Left Page */}
            <div className={cn(
              "absolute w-1/2 h-full left-0 top-0 rounded-l-lg shadow-xl preserve-3d origin-right border-r border-black/20",
               currentPage === 'cover' ? 'hidden' : 'block',
               getPageClass('left')
            )}>
              <div className="absolute inset-0 backface-hidden rounded-l-lg overflow-hidden">
                {currentPageIndex > 0 && renderPageContent(pageOrder[currentPageIndex - 1], currentPageIndex - 1)}
              </div>
              <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] rounded-l-lg overflow-hidden">
                 {renderPageContent(pageOrder[currentPageIndex], currentPageIndex)}
              </div>
            </div>

            {/* Right Page */}
            <div className={cn(
                "absolute w-1/2 h-full right-0 top-0 rounded-r-lg shadow-2xl preserve-3d origin-left",
                currentPage === 'cover' && 'w-full rounded-lg',
                getPageClass('right')
            )}>
                <div className="absolute inset-0 backface-hidden rounded-r-lg overflow-hidden">
                    {renderPageContent(currentPage, currentPageIndex)}
                </div>
                 <div className="absolute inset-0 backface-hidden [transform:rotateY(-180deg)] rounded-r-lg overflow-hidden">
                    {currentPageIndex > 0 && renderPageContent(pageOrder[currentPageIndex+1], currentPageIndex+1)}
                </div>
            </div>

             {/* Book Spine */}
            <div className={cn("hidden md:block absolute w-8 h-full top-0 left-1/2 -translate-x-1/2 bg-stone-900 shadow-inner-lg transform origin-center preserve-3d", currentPage==='cover' ? 'opacity-0' : 'opacity-100')}>
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-amber-900 via-stone-950 to-amber-900"></div>
                <div className="w-full h-full bg-repeat-y bg-[length:100%_10px]" style={{backgroundImage: 'linear-gradient(to bottom, transparent, transparent 4px, hsl(var(--border)) 4px, hsl(var(--border)) 5px, transparent 5px, transparent 10px)'}} />
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
