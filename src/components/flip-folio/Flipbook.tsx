'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PortfolioData, Project, Skill } from '@/lib/types';
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
import EducationPage from './pages/EducationPage';
import AchievementsPage from './pages/AchievementsPage';
import SkillDetailDialog from './SkillDetailDialog';
import HTMLFlipBook from 'react-pageflip';

type Page = 'cover' | 'toc' | 'about' | 'education' | 'skills' | 'experience' | 'achievements' | 'projects' | 'contact';
const pageOrder: Page[] = ['cover', 'toc', 'about', 'education', 'skills', 'experience', 'achievements', 'projects', 'contact'];

const PageComponentWrapper = React.forwardRef<HTMLDivElement, { children: React.ReactNode, isCover?: boolean, pageNumber: number }>(
  ({ children, isCover, pageNumber }, ref) => {
    return (
      <div ref={ref} className={cn("overflow-hidden", isCover ? "bg-stone-950" : "bg-page-background text-page-foreground")}>
        <div className={cn(
            "p-8 md:p-10 h-full w-full relative",
        )}>
            {!isCover && (
                <div className={cn(
                    "absolute inset-y-0 w-8 pointer-events-none",
                    pageNumber % 2 === 0 ? "left-0 bg-gradient-to-r from-black/10 to-transparent" : "right-0 bg-gradient-to-l from-black/10 to-transparent"
                )} />
            )}
            
            <div className="relative z-10 h-full w-full">
                {children}
            </div>
            
            {!isCover && (
                 <div className={cn(
                    "absolute bottom-4 text-xs font-sans",
                    pageNumber % 2 === 0 ? "left-6" : "right-6",
                    "text-page-foreground/50"
                 )}>
                    {pageNumber}
                </div>
            )}
        </div>
      </div>
    );
  }
);
PageComponentWrapper.displayName = 'PageComponentWrapper';


export default function Flipbook({ data }: { data: PortfolioData }) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);
  const bookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [bookDimensions, setBookDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        
        if (isMobile) {
            setBookDimensions({ width: containerWidth, height: containerHeight });
        } else {
            const aspectRatio = 10 / 7;
            let newWidth = containerWidth;
            let newHeight = newWidth / aspectRatio;

            if (newHeight > containerHeight) {
                newHeight = containerHeight;
                newWidth = newHeight * aspectRatio;
            }
             setBookDimensions({ width: newWidth, height: newHeight });
        }
      }
    };
    
    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [isMounted, isMobile]);

  const totalPages = pageOrder.length;

  const onFlip = useCallback((e: { data: number }) => {
    setCurrentPageIndex(e.data);
  }, []);

  const navigate = (page: Page) => {
    const newIndex = pageOrder.indexOf(page);
    if (bookRef.current) {
      bookRef.current.pageFlip().turnToPage(newIndex);
    }
    setCurrentPageIndex(newIndex);
  };

  const nextPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const renderPageContent = (page: Page, pageNumber: number) => {
    switch (page) {
        case 'cover':
            return <CoverPage onOpen={() => navigate('toc')} />;
        case 'toc':
            return <TableOfContents onNavigate={navigate} />;
        case 'about':
            return <AboutPage personalInfo={data.personalInfo} imageUrl={data.authorImageUrl} imageHint={data.authorImageHint} />;
        case 'education':
            return <EducationPage education={data.education} />;
        case 'skills':
            return <SkillsPage skills={data.skills} onSkillSelect={setSelectedSkill} />;
        case 'experience':
            return <ExperiencePage experience={data.experience} />;
        case 'achievements':
            return <AchievementsPage achievements={data.achievements} />;
        case 'projects':
            return <ProjectsPage projects={data.projects} onProjectSelect={setSelectedProject} />;
        case 'contact':
            return <ContactPage contactDetails={data.contactDetails} socials={data.socials} />;
        default:
            return null;
    }
  }

  if (!isMounted) {
    return (
        <main ref={containerRef} className="flex h-dvh w-full flex-col items-center justify-center bg-background p-4 overflow-hidden">
            <div className="relative w-full max-w-6xl aspect-[10/7]">
                 {/* Placeholder for pre-render */}
            </div>
             <div className="flex justify-center items-center gap-4 mt-4 flex-shrink-0 h-10">
             </div>
        </main>
    );
  }

  const flipbookPages = pageOrder.map((page, index) => (
    <PageComponentWrapper key={index} isCover={page === 'cover'} pageNumber={index}>
        {renderPageContent(page, index)}
    </PageComponentWrapper>
  ));


  return (
    <main className="flex h-dvh w-full flex-col items-center justify-center bg-background p-4 overflow-hidden">
      <div ref={containerRef} className="relative flex-grow w-full flex items-center justify-center">
        {bookDimensions.width > 0 && (
            <div style={{ width: bookDimensions.width, height: bookDimensions.height }}>
              <HTMLFlipBook
                ref={bookRef}
                width={isMobile ? bookDimensions.width : bookDimensions.width / 2}
                height={bookDimensions.height}
                onFlip={onFlip}
                showCover={true}
                className="shadow-2xl rounded-lg"
                useMouseEvents={!isMobile}
                flippingTime={600}
                size={isMobile ? "stretch" : "fixed"}
                minWidth={300}
                maxWidth={1000}
                minHeight={400}
                maxHeight={1400}
                drawShadow={true}
                mobileScrollSupport={false}
              >
                {flipbookPages}
              </HTMLFlipBook>
            </div>
        )}
      </div>

       <div className="flex justify-center items-center gap-4 mt-4 flex-shrink-0">
          <Button onClick={prevPage} disabled={currentPageIndex === 0} variant="outline" size="icon" className="bg-background/50">
              <ArrowLeft />
          </Button>
          <span className="text-sm text-foreground/70">{currentPageIndex === 0 ? 'Cover' : `${currentPageIndex} / ${totalPages - 1}`}</span>
          <Button onClick={nextPage} disabled={currentPageIndex >= totalPages -1} variant="outline" size="icon" className="bg-background/50">
              <ArrowRight />
          </Button>
       </div>

      <ProjectDetailDialog project={selectedProject} open={!!selectedProject} onOpenChange={() => setSelectedProject(null)} />
      <SkillDetailDialog skill={selectedSkill} open={!!selectedSkill} onOpenChange={() => setSelectedSkill(null)} />
    </main>
  );
}
