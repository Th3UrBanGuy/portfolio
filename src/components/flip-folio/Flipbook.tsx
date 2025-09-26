'use client';

import { useState } from 'react';
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

type Page = 'cover' | 'toc' | 'about' | 'projects' | 'contact';

const pageOrder: Page[] = ['cover', 'toc', 'about', 'projects', 'contact'];

export default function Flipbook({ data }: { data: PortfolioData }) {
  const [currentPage, setCurrentPage] = useState<Page>('cover');
  const [direction, setDirection] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const currentPageIndex = pageOrder.indexOf(currentPage);

  const navigate = (page: Page) => {
    const newIndex = pageOrder.indexOf(page);
    setDirection(newIndex > currentPageIndex ? 1 : -1);
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPageIndex < pageOrder.length - 1) {
      setDirection(1);
      setCurrentPage(pageOrder[currentPageIndex + 1]);
    }
  };

  const prevPage = () => {
    if (currentPageIndex > 0) {
      setDirection(-1);
      setCurrentPage(pageOrder[currentPageIndex - 1]);
    }
  };

  const renderPage = () => {
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
  };

  return (
    <main className="flex h-screen w-full items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <Card className="relative flex aspect-[1/1.4] w-full max-w-md flex-col overflow-hidden shadow-2xl md:aspect-video md:max-w-4xl md:flex-row">
        {/* Static left-side panel for desktop */}
        <div className="hidden md:flex md:w-1/2 md:flex-col md:items-center md:justify-center md:bg-primary/5 md:p-8">
           <TableOfContents onNavigate={navigate} isStaticPanel={true} />
        </div>
        <div className="hidden md:block md:border-l"></div>
        {/* Animated right-side panel for desktop, full view for mobile */}
        <div className="relative h-full w-full overflow-hidden md:w-1/2">
          <div className="absolute inset-0 p-6 sm:p-8">
            {renderPage()}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between md:hidden">
            <Button onClick={prevPage} disabled={currentPageIndex === 0} variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button onClick={() => navigate('toc')} variant="outline" size="icon">
              <Home className="h-4 w-4" />
            </Button>
            <Button onClick={nextPage} disabled={currentPageIndex === pageOrder.length - 1} variant="outline" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
        </div>
      </Card>
      
      <ProjectDetailDialog project={selectedProject} open={!!selectedProject} onOpenChange={() => setSelectedProject(null)} />
    </main>
  );
}
