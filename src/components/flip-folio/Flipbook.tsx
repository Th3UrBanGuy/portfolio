'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PortfolioData, Project, Skill, Page } from '@/lib/types';
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
import BackCoverPage from './pages/BackCoverPage';
import Preloader from '../Preloader';
import StaticIntroPage from './pages/StaticIntroPage';
import StaticOutroPage from './pages/StaticOutroPage';
import PrivateInfoPage from './pages/PrivateInfoPage';

const PageComponentWrapper = React.forwardRef<HTMLDivElement, { children: React.ReactNode, isCover?: boolean, isBackCover?: boolean, pageNumber: number }>(({ children, isCover, isBackCover, pageNumber }, ref) => {
  return (
    <div ref={ref} className={cn("overflow-hidden", (isCover || isBackCover) ? "bg-stone-950" : "bg-page-background text-page-foreground")}>
      <div className={cn(
          "p-8 md:p-10 h-full w-full relative",
      )}>
          {!(isCover || isBackCover) && (
              <div className={cn(
                  "absolute inset-y-0 w-8 pointer-events-none",
                  pageNumber % 2 === 0 ? "left-0 bg-gradient-to-r from-black/10 to-transparent" : "right-0 bg-gradient-to-l from-black/10 to-transparent"
              )} />
          )}
          
          <div className="relative z-10 h-full w-full">
              {children}
          </div>
          
          {!(isCover || isBackCover) && (
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
});
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

  const onFlip = useCallback((e: { data: number }) => {
    setCurrentPageIndex(e.data);
  }, []);

  const pageOrder = data?.pageSequence?.activePages;

  if (!isMounted || !data || !pageOrder) {
    return (
        <div className="h-dvh w-full bg-background flex items-center justify-center">
            <Preloader showFire={true} isClosing={false} />
        </div>
    );
  }

  const totalPages = pageOrder.length;

  const navigate = (page: Page) => {
    const newIndex = pageOrder.indexOf(page);
    if (bookRef.current && newIndex !== -1) {
      bookRef.current.pageFlip().turnToPage(newIndex);
    }
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

  const handleOpenBook = () => {
    nextPage();
  };

  const renderPageContent = (page: Page, pageNumber: number) => {
    const titles = data.pageTitles.find(p => p.id === page);
    switch (page) {
        case 'cover':
            return <CoverPage onOpen={handleOpenBook} />;
        case 'toc':
            return <TableOfContents onNavigate={navigate} activePages={pageOrder} pageTitles={data.pageTitles} />;
        case 'about':
            return <AboutPage personalInfo={data.personalInfo} imageUrl={data.authorImageUrl} imageHint={data.authorImageHint} aboutMe={data.aboutMe} cvLink={data.cvLink} />;
        case 'education':
            return <EducationPage education={data.education} title={titles?.pageTitle ?? 'Education'} />;
        case 'skills':
            return <SkillsPage skills={data.skills} onSkillSelect={setSelectedSkill} title={titles?.pageTitle ?? 'Skills'} />;
        case 'experience':
            return <ExperiencePage experience={data.experience} title={titles?.pageTitle ?? 'Experience'} />;
        case 'achievements':
            return <AchievementsPage achievements={data.achievements} title={titles?.pageTitle ?? 'Achievements'} />;
        case 'private-info':
            return <PrivateInfoPage privateInfo={data.privateInfo} title={titles?.pageTitle ?? 'Private Sanctum'} />;
        case 'projects':
            return <ProjectsPage projects={data.projects} onProjectSelect={setSelectedProject} title={titles?.pageTitle ?? 'Projects'} />;
        case 'contact':
            return <ContactPage contactDetails={data.contactDetails} socials={data.socials} customLinks={data.customLinks} title={titles?.pageTitle ?? 'Contact'}/>;
        case 'back-cover':
            return <BackCoverPage />;
        case 'blank-page':
            return <div></div>;
        default:
            return null;
    }
  }

  const pages: Page[] = [];
  const coverPage = pageOrder.find(p => p === 'cover');
  const backCoverPage = pageOrder.find(p => p === 'back-cover');
  const contentPages = pageOrder.filter(p => p !== 'cover' && p !== 'back-cover');

  if (coverPage) {
    pages.push(coverPage);
  }

  pages.push(...contentPages);

  if (!isMobile && contentPages.length % 2 !== 0) {
    pages.push('blank-page' as Page);
  }

  if (backCoverPage) {
    pages.push(backCoverPage);
  }

  const flipbookPages = pages.map((page, index) => (
    <PageComponentWrapper key={index} isCover={page === 'cover'} isBackCover={page === 'back-cover'} pageNumber={index}>
        {renderPageContent(page, index)}
    </PageComponentWrapper>
  ));

  const finalTotalPages = flipbookPages.length;


  return (
    <>
        <main className="flex h-dvh w-full flex-col items-center justify-center bg-background p-4 overflow-hidden">
        <div ref={containerRef} className="relative flex-grow w-full flex items-center justify-center">
            {bookDimensions.width > 0 && (
                <div style={{ width: bookDimensions.width, height: bookDimensions.height }} className='relative'>
                    
                    {!isMobile && currentPageIndex === 0 && (
                        <div className='absolute left-0 top-0 bottom-0 w-1/2'>
                           <StaticIntroPage />
                        </div>
                    )}
                    
                    <HTMLFlipBook
                        ref={bookRef}
                        width={isMobile ? bookDimensions.width : bookDimensions.width / 2}
                        height={bookDimensions.height}
                        onFlip={onFlip}
                        showCover={true}
                        className="shadow-2xl rounded-lg"
                        useMouseEvents={false}
                        flippingTime={600}
                        size={isMobile ? "stretch" : "fixed"}
                        minWidth={300}
                        maxWidth={1000}
                        minHeight={400}
                        maxHeight={1400}
                        drawShadow={true}
                        mobileScrollSupport={true}
                    >
                        {flipbookPages}
                    </HTMLFlipBook>

                     {!isMobile && currentPageIndex === finalTotalPages - 1 && (
                        <div className='absolute right-0 top-0 bottom-0 w-1/2'>
                           <StaticOutroPage />
                        </div>
                    )}
                </div>
            )}
        </div>

        <div className="flex justify-center items-center gap-4 mt-4 flex-shrink-0">
            <Button onClick={prevPage} disabled={currentPageIndex === 0} variant="outline" size="icon" className="bg-background/50">
                <ArrowLeft />
            </Button>
            <span className="text-sm text-foreground/70">{currentPageIndex === 0 ? 'Cover' : currentPageIndex === finalTotalPages - 1 ? 'Back Cover' : `${currentPageIndex} / ${finalTotalPages - 2}`}</span>
            <Button onClick={nextPage} disabled={currentPageIndex >= finalTotalPages - 1} variant="outline" size="icon" className="bg-background/50">
                <ArrowRight />
            </Button>
        </div>

        <ProjectDetailDialog project={selectedProject} open={!!selectedProject} onOpenChange={() => setSelectedProject(null)} />
        <SkillDetailDialog skill={selectedSkill} open={!!selectedSkill} onOpenChange={() => setSelectedSkill(null)} />
        </main>
    </>
  );
}