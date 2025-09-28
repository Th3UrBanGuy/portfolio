'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

type PreloaderProps = {
  showFire: boolean;
  isClosing: boolean;
};

export default function Preloader({ showFire, isClosing }: PreloaderProps) {
  return (
    <div 
      id="preloader"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-1000",
        showFire ? "opacity-100" : "opacity-0 pointer-events-none",
        isClosing && "bg-background"
      )}
      style={{ backgroundColor: !isClosing ? '#252627' : undefined }}
    >
      <Image 
        src="https://gifdb.com/images/high/blue-fire-498-x-498-gif-wnffgxmn5h3b7dkg.webp" 
        alt="Mystical Fire..." 
        width={300} 
        height={300} 
        unoptimized 
      />
    </div>
  );
}
