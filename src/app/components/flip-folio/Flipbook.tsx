'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PortfolioData, Project, Skill } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import CoverPage from './pages/CoverPage';
import TableOfContents from './pages/TableOfContents';
import AboutPage from './pages/AboutPage';
import PrivateInfoPage from './pages/PrivateInfoPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import ProjectDetailDialog from '@/components/flip-folio/ProjectDetailDialog';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import SkillsPage from './pages/SkillsPage';
import ExperiencePage from './pages/ExperiencePage';
import EducationPage from './pages/EducationPage';
import AchievementsPage from './pages/AchievementsPage';
import SkillDetailDialog from '@/components/flip-folio/SkillDetailDialog';
import HTMLFlipBook from 'react-pageflip';
import BackCoverPage from './pages/BackCoverPage';
import Preloader from '@/components/Preloader';
import StaticIntroPage from './pages/StaticIntroPage';
import StaticOutroPage from './pages/StaticOutroPage';


type Page = 'cover' | 'toc' | 'about' | 'private-info' | 'education' | 'skills' | 'experience' | 'achievements' | 'projects' | 'contact' | 'back-cover';
const pageOrder: Page[] = ['cover', 'toc', 'about', 'private-info', 'education', 'skills', 'experience', 'achievements', 'projects', 'contact', 'back-cover'];

const PageComponentWrapper = React.forwardRef<HTMLDivElement, { children: React.ReactNode, isCover?: boolean, isBackCover?: boolean, pageNumber: number }>(
  ({ children, isCover, isBackCover, pageNumber }, ref) => {
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

  const handleOpenBook = () => {
    navigate('toc');
  };

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
    const pageTitle = data.pageTitles.find(p => p.id === page)?.title;
    switch (page) {
        case 'cover':
            return <CoverPage onOpen={handleOpenBook} />;
        case 'toc':
            return <TableOfContents onNavigate={navigate} />;
        case 'about':
            return <AboutPage personalInfo={data.personalInfo} imageUrl={data.authorImageUrl} imageHint={data.authorImageHint} aboutMe={data.aboutMe} cvLink={data.cvLink} />;
        case 'private-info':
            return <PrivateInfoPage privateInfo={data.privateInfo} title={pageTitle ?? 'Private Sanctum'} />;
        case 'education':
            return <EducationPage education={data.education} title={pageTitle ?? 'Education'} />;
        case 'skills':
            return <SkillsPage skills={data.skills} onSkillSelect={setSelectedSkill} title={pageTitle ?? 'Skills'} />;
        case 'experience':
            return <ExperiencePage experience={data.experience} title={pageTitle ?? 'Experience'} />;
        case 'achievements':
            return <AchievementsPage achievements={data.achievements} title={pageTitle ?? 'Achievements'} />;
        case 'projects':
            return <ProjectsPage projects={data.projects} onProjectSelect={setSelectedProject} title={pageTitle ?? 'Projects'} />;
        case 'contact':
            return <ContactPage contactDetails={data.contactDetails} socials={data.socials} customLinks={data.customLinks} title={pageTitle ?? 'Contact'}/>;
        case 'back-cover':
            return <BackCoverPage />;
        default:
            return null;
    }
  }

  if (!isMounted || !data) {
    return (
        <div className="h-dvh w-full bg-background flex items-center justify-center">
            <Preloader showFire={true} isClosing={false} />
        </div>
    );
  }

  const flipbookPages = pageOrder.map((page, index) => (
    <PageComponentWrapper key={index} isCover={page === 'cover'} isBackCover={page === 'back-cover'} pageNumber={index}>
        {renderPageContent(page, index)}
    </PageComponentWrapper>
  ));


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

                     {!isMobile && currentPageIndex === totalPages - 1 && (
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
            <span className="text-sm text-foreground/70">{currentPageIndex === 0 ? 'Cover' : currentPageIndex === totalPages - 1 ? 'Back Cover' : `${currentPageIndex} / ${totalPages - 2}`}</span>
            <Button onClick={nextPage} disabled={currentPageIndex >= totalPages - 1} variant="outline" size="icon" className="bg-background/50">
                <ArrowRight />
            </Button>
        </div>

        <ProjectDetailDialog project={selectedProject} open={!!selectedProject} onOpenChange={() => setSelectedProject(null)} />
        <SkillDetailDialog skill={selectedSkill} open={!!selectedSkill} onOpenChange={() => setSelectedSkill(null)} />
        </main>
    </>
  );
}
