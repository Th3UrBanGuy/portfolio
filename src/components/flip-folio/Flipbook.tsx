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
import BackCoverPage from './pages/BackCoverPage';
import Preloader from '../Preloader';
import StaticIntroPage from './pages/StaticIntroPage';
import StaticOutroPage from './pages/StaticOutroPage';
import { runRecordViewerFlow } from '@/ai/flows/record-viewer-flow';


type Page = 'cover' | 'toc' | 'about' | 'education' | 'skills' | 'experience' | 'achievements' | 'projects' | 'contact' | 'back-cover';
const pageOrder: Page[] = ['cover', 'toc', 'about', 'education', 'skills', 'experience', 'achievements', 'projects', 'contact', 'back-cover'];

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

  const [hasIntroPlayed, setHasIntroPlayed] = useState(false);
  const [showFire, setShowFire] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);


  useEffect(() => {
    if (hasIntroPlayed) {
        setShowFire(false);
        setShowContent(true);
        return;
    }

    const introTimer = setTimeout(() => {
        setShowFire(false);
        setShowContent(true);
        setHasIntroPlayed(true);
    }, 3000);

    return () => clearTimeout(introTimer);
  }, [hasIntroPlayed]);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleOpenBook = () => {
    if (!hasRecorded) {
      recordViewerData();
      setHasRecorded(true);
    }
    navigate('toc');
  };

  const getIpInfo = async () => {
    const services = [
        async () => {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return { ip: data.ip, city: data.city, country: data.country_name, isp: data.org, ipType: data.version, region: data.region, postal: data.postal, asn: data.asn };
        },
        async () => {
            const response = await fetch('https://ipinfo.io/json');
            const data = await response.json();
            const [ip, ipType] = data.ip.includes(':') ? [data.ip, 'IPv6'] : [data.ip, 'IPv4'];
            return { ip, city: data.city, country: data.country, isp: data.org, ipType, region: data.region, postal: data.postal, asn: data.asn };
        },
        async () => {
            const response = await fetch('https://freeipapi.com/api/json');
            const data = await response.json();
            return { ip: data.ipAddress, city: data.cityName, country: data.countryName, isp: data.isp, ipType: data.ipVersion, region: data.regionName, postal: data.zipCode, asn: `AS${data.asNumber}` };
        },
    ];

    for (const service of services) {
        try {
            const result = await service();
            if (result.ip) return result;
        } catch (error) {
            console.warn("IP info service failed, trying next one.", error);
        }
    }

    return { ip: 'N/A', city: 'N/A', country: 'N/A', isp: 'N/A', ipType: 'N/A', region: 'N/A', postal: 'N/A', asn: 'N/A' };
  }

  const recordViewerData = async () => {
    try {
        const getBrowserInfo = () => {
            const userAgent = navigator.userAgent;
            let browserName = "Unknown";
            if (userAgent.includes("Firefox")) browserName = "Firefox";
            else if (userAgent.includes("SamsungBrowser")) browserName = "Samsung Browser";
            else if (userAgent.includes("Opera") || userAgent.includes("OPR")) browserName = "Opera";
            else if (userAgent.includes("Trident")) browserName = "Internet Explorer";
            else if (userAgent.includes("Edge")) browserName = "Edge";
            else if (userAgent.includes("Chrome")) browserName = "Chrome";
            else if (userAgent.includes("Safari")) browserName = "Safari";
            return browserName;
        }

        const getOS = () => {
            const userAgent = navigator.userAgent;
            if (userAgent.includes("Win")) return "Windows";
            if (userAgent.includes("Mac")) return "MacOS";
            if (userAgent.includes("X11")) return "UNIX";
            if (userAgent.includes("Linux")) return "Linux";
            if (userAgent.includes("Android")) return "Android";
            if (userAgent.includes("like Mac")) return "iOS";
            return "Unknown";
        }
      
        const ipData = await getIpInfo();

        const viewerData = {
            ip: ipData.ip || 'N/A',
            city: ipData.city || 'N/A',
            country: ipData.country || 'N/A',
            isp: ipData.isp || 'N/A',
            ipType: ipData.ipType || 'N/A',
            region: ipData.region || 'N/A',
            postal: ipData.postal || 'N/A',
            asn: ipData.asn || 'N/A',
            browser: getBrowserInfo(),
            os: getOS(),
            resolution: `${window.screen.width}x${window.screen.height}`,
            deviceMemory: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'N/A',
            cpuCores: (navigator.hardwareConcurrency && navigator.hardwareConcurrency !== Infinity) ? navigator.hardwareConcurrency : 'N/A',
        };
      
        await runRecordViewerFlow(viewerData);

    } catch (error) {
      console.error("Failed to record viewer data after all fallbacks:", error);
    }
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
    if (isClosing) {
        if (isMobile && e.data === totalPages - 1) {
            setTimeout(() => bookRef.current.pageFlip().turnToPage(0), 500);
        } else if (e.data === 0) {
            setShowContent(false);
            setShowFire(true);
        }
    }
  }, [isClosing, isMobile, totalPages]);


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
            return <CoverPage onOpen={handleOpenBook} />;
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
        case 'back-cover':
            return <BackCoverPage />;
        default:
            return null;
    }
  }

  if (!isMounted) {
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
        <Preloader showFire={showFire} isClosing={isClosing} />
        <main className={cn("flex h-dvh w-full flex-col items-center justify-center bg-background p-4 overflow-hidden transition-opacity duration-500", showContent ? "opacity-100" : "opacity-0")}>
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
            <Button onClick={nextPage} disabled={currentPageIndex >= totalPages -1} variant="outline" size="icon" className="bg-background/50">
                <ArrowRight />
            </Button>
        </div>

        <ProjectDetailDialog project={selectedProject} open={!!selectedProject} onOpenChange={() => setSelectedProject(null)} />
        <SkillDetailDialog skill={selectedSkill} open={!!selectedSkill} onOpenChange={() => setSelectedSkill(null)} />
        </main>
    </>
  );
}
