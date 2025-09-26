'use client';

import { useState } from 'react';
import type { PortfolioData } from '@/lib/types';
import { generatePortfolioAction } from '@/app/actions';
import { defaultPortfolioData } from '@/lib/placeholder-data';
import AIGenerator from '@/components/flip-folio/AIGenerator';
import Flipbook from '@/components/flip-folio/Flipbook';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [step, setStep] = useState<'generator' | 'portfolio'>('generator');
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (url: string) => {
    setIsLoading(true);
    try {
      const result = await generatePortfolioAction(url);
      setPortfolioData(result);
      setStep('portfolio');
      toast({
        title: 'Success!',
        description: 'Your portfolio has been generated.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating your portfolio. Please try again.',
      });
      // Optionally fall back to default data on error
      // handleSkip();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setPortfolioData(defaultPortfolioData);
    setStep('portfolio');
    toast({
      title: 'Using Sample Data',
      description: 'Explore FlipFolio with our sample portfolio.',
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground">Flipping through the web...</p>
        <p className="text-muted-foreground">Generating your portfolio, please wait.</p>
      </div>
    );
  }

  if (step === 'portfolio' && portfolioData) {
    return <Flipbook data={portfolioData} />;
  }

  return <AIGenerator onGenerate={handleGenerate} onSkip={handleSkip} />;
}
