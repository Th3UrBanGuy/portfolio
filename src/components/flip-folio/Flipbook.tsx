'use client';

import React, { useState } from 'react';
import type { PortfolioData, Project } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';

import CoverPage from './pages/CoverPage';
import TableOfContents from './pages/TableOfContents';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import ProjectDetailDialog from './ProjectDetailDialog';
import { cn } from '@/lib/utils';

type Page = 'cover' | 'toc' | 'about' | 'projects' | 'contact';

const pageOrder: Page[] = ['cover', 'toc', 'about', 'projects', 'contact'];

export default function Flipbook({ data }: { data: PortfolioData }) {
  const [currentPage, setCurrentPage] = useState<Page>('cover');
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [isFlipping, setIsFlipping] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const currentPageIndex = pageOrder.indexOf(currentPage);

  const navigate = (page: Page) => {
    if (isFlipping) return;
    const newIndex = pageOrder.indexOf(page);
    if (newIndex === currentPageIndex) return;
    
    setIsFlipping(true);
    setDirection(newIndex > currentPageIndex ? 1 : -1);
    
    setTimeout(() => {
      setCurrentPage(page);
      setIsFlipping(false);
      setDirection(0);
    }, 300); // Half of the animation duration
  };

  const nextPage = () => {
    if (currentPageIndex < pageOrder.length - 1) {
      navigate(pageOrder[currentPageIndex + 1]);
    }
  };

  const prevPage = () => {
    if (currentPageIndex > 0) {
      navigate(pageOrder[currentPageIndex - 1]);
    }
  };
  
  const renderPage = () => {
    const pageProps = {
      key: currentPage, // Ensures component re-mounts on page change
      className: cn(
        "absolute inset-0 p-6 sm:p-8 transition-transform duration-700 ease-in-out backface-hidden",
        direction === 1 && "animate-flip-out-to-left",
        direction === -1 && "animate-flip-out-to-right",
      )
    };
    
    const pageContent = () => {
        switch (currentPage) {
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
    
    // This logic is a bit tricky. We need to render the content with a wrapper
    // that has the animation classes.
    const content = pageContent();
    if (content && content.props) {
        // Clone the element and add the animation class
        return React.cloneElement(content, { ...content.props, className: cn(content.props.className, pageProps.className)}, content.props.children);
    }
    
    return <div {...pageProps}>{pageContent()}</div>;
  };


  return (
    <main className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4 sm:p-6 md:p-8">
      <Card className="relative flex aspect-[1/1.5] w-full max-w-xl flex-col overflow-hidden shadow-2xl md:aspect-video md:max-w-6xl md:flex-row perspective">
        {/* Static left-side panel for desktop */}
        <div className="hidden md:flex md:w-1/2 md:flex-col md:items-center md:justify-center md:bg-primary/5 md:p-8">
           <TableOfContents onNavigate={navigate} isStaticPanel={true} />
        </div>
        <div className="hidden md:block border-l-2 border-dashed border-border/50"></div>
        
        {/* Animated right-side panel for desktop, full view for mobile */}
        <div className="relative h-full w-full overflow-hidden md:w-1/2 preserve-3d">
            {renderPage()}
        </div>

        {/* Mobile Navigation */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between md:hidden">
            <Button onClick={prevPage} disabled={currentPageIndex === 0 || isFlipping} variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button onClick={() => navigate('toc')} variant="outline" size="icon" disabled={isFlipping}>
              <Home className="h-4 w-4" />
            </Button>
            <Button onClick={nextPage} disabled={currentPageIndex === pageOrder.length - 1 || isFlipping} variant="outline" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
        </div>
      </Card>
      
      <ProjectDetailDialog project={selectedProject} open={!!selectedProject} onOpenChange={() => setSelectedProject(null)} />
    </main>
  );
}
