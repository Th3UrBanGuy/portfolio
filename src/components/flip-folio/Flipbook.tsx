'use client';

import React, { useState } from 'react';
import type { PortfolioData, Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import CoverPage from './pages/CoverPage';
import TableOfContents from './pages/TableOfContents';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import ProjectDetailDialog from './ProjectDetailDialog';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import SkillsPage from './pages/SkillsPage';
import ExperiencePage from './pages/ExperiencePage';

type Page = 'cover' | 'toc' | 'about' | 'skills' | 'experience' | 'projects' | 'contact';

const pageOrder: Page[] = ['cover', 'toc', 'about', 'skills', 'experience', 'projects', 'contact'];

export default function Flipbook({ data }: { data: PortfolioData }) {
  const [currentPage, setCurrentPage] = useState<Page>('cover');
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const currentPageIndex = pageOrder.indexOf(currentPage);
  const totalPages = pageOrder.length;

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextPage();
    }
    if (isRightSwipe) {
      prevPage();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const navigate = (page: Page) => {
    if (isFlipping) return;
    const newIndex = pageOrder.indexOf(page);
    if (newIndex === currentPageIndex) return;

    setIsFlipping(true);
    setDirection(newIndex > currentPageIndex ? 'next' : 'prev');

    setTimeout(() => {
      setCurrentPage(page);
      setIsFlipping(false);
      setDirection(null);
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
                return <AboutPage personalInfo={data.personalInfo} education={data.education} imageUrl={data.authorImageUrl} imageHint={data.authorImageHint} />;
            case 'skills':
                return <SkillsPage skills={data.skills} />;
            case 'experience':
                return <ExperiencePage experience={data.experience} />;
            case 'projects':
                return <ProjectsPage projects={data.projects} onProjectSelect={setSelectedProject} />;
            case 'contact':
                return <ContactPage />;
            default:
                return null;
        }
    }

    const isCover = pageNumber === 0;

    return (
        <div className={cn(
            "p-8 md:p-10 h-full w-full relative overflow-hidden",
            isCover ? "bg-stone-950" : "bg-page-background text-page-foreground"
        )}>
            {!isCover && (
                <div className={cn(
                    "absolute inset-y-0 w-8 pointer-events-none",
                    pageNumber % 2 === 0 ? "left-0 bg-gradient-to-r from-black/10 to-transparent" : "right-0 bg-gradient-to-l from-black/10 to-transparent"
                )} />
            )}
            
            <div className="relative z-10 h-full w-full">
                {pageContent()}
            </div>
            
            {!isCover && (
                 <div className={cn(
                    "absolute bottom-4 text-xs font-sans",
                    isMobile ? (pageNumber % 2 === 0 ? "left-6" : "right-6") : (pageNumber % 2 === 0 ? "left-6" : "right-6"),
                    isCover ? "text-amber-200/50" : "text-page-foreground/50"
                 )}>
                    Page {pageNumber}
                </div>
            )}
        </div>
    )
  };
  
  const getPageClass = (page: 'left' | 'right') => {
    if (!isFlipping) return 'transform-none';
    
    if (direction === 'next') {
        return page === 'right' ? 'animate-flip-out-next' : 'animate-flip-in-next';
    }
    if (direction === 'prev') {
        return page === 'left' ? 'animate-flip-out-prev' : 'animate-flip-in-prev';
    }
    return 'transform-none';
  }

  const getMobilePageClass = () => {
     if (!isFlipping) return 'transform-none';
      if (direction === 'next') {
        return 'animate-flip-out-next';
      }
      if (direction === 'prev') {
        return 'animate-flip-out-prev';
      }
    return 'transform-none';
  }

  return (
    <main className="flex h-dvh w-full flex-col items-center justify-center bg-background p-4 overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative flex-grow w-full perspective flex items-center justify-center">
        {isMobile ? (
             <div className="w-full h-full relative perspective">
                <div className={cn(
                    "w-full h-full rounded-lg shadow-2xl preserve-3d origin-center",
                     getMobilePageClass()
                )}>
                     <div className="absolute inset-0 backface-hidden rounded-lg overflow-hidden">
                        {renderPageContent(currentPage, currentPageIndex)}
                    </div>
                     <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] rounded-lg overflow-hidden">
                        {direction === 'prev' && currentPageIndex > 0 ? renderPageContent(pageOrder[currentPageIndex - 1], currentPageIndex - 1) :
                         direction === 'next' && currentPageIndex < totalPages - 1 ? renderPageContent(pageOrder[currentPageIndex + 1], currentPageIndex + 1) : null
                        }
                    </div>
                </div>
             </div>
        ) : (
             <div className={cn("relative w-full max-w-6xl aspect-[2/1.4] preserve-3d transition-transform duration-500 ease-in-out", currentPage === 'cover' && 'md:group-hover:rotate-y-2')}>
                {/* Left Page */}
                <div className={cn(
                  "absolute w-1/2 h-full left-0 top-0 rounded-l-lg shadow-xl preserve-3d origin-right border-r border-black/20",
                   currentPage === 'cover' ? 'hidden' : 'block',
                   getPageClass('left')
                )} >
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
                )} >
                    <div className="absolute inset-0 backface-hidden rounded-r-lg overflow-hidden">
                        {renderPageContent(currentPage, currentPageIndex)}
                    </div>
                     <div className="absolute inset-0 backface-hidden [transform:rotateY(-180deg)] rounded-r-lg overflow-hidden">
                        {currentPageIndex < totalPages - 1 && renderPageContent(pageOrder[currentPageIndex+1], currentPageIndex+1)}
                    </div>
                </div>

                 {/* Book Spine */}
                <div className={cn("hidden md:block absolute w-8 h-full top-0 left-1/2 -translate-x-1/2 bg-stone-900 shadow-inner-lg transform origin-center preserve-3d", currentPage==='cover' ? 'opacity-0' : 'opacity-100')}>
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-amber-900 via-stone-950 to-amber-900"></div>
                    <div className="w-full h-full bg-repeat-y bg-[length:100%_10px]" style={{backgroundImage: 'linear-gradient(to bottom, transparent, transparent 4px, hsl(var(--border)) 4px, hsl(var(--border)) 5px, transparent 5px, transparent 10px)'}} />
                </div>
            </div>
        )}
      </div>

       <div className="flex justify-center items-center gap-4 mt-4 flex-shrink-0">
          <Button onClick={prevPage} disabled={isFlipping || currentPageIndex === 0} variant="outline" size="icon" className="bg-background/50">
              <ArrowLeft />
          </Button>
          <span className="text-sm text-foreground/70">{currentPage === 'cover' ? 'Cover' : `${currentPageIndex} / ${totalPages - 1}`}</span>
          <Button onClick={nextPage} disabled={isFlipping || currentPageIndex === totalPages - 1} variant="outline" size="icon" className="bg-background/50">
              <ArrowRight />
          </Button>
       </div>

      <ProjectDetailDialog project={selectedProject} open={!!selectedProject} onOpenChange={() => setSelectedProject(null)} />
    </main>
  );
}
