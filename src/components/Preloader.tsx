'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.style.opacity = '1';
        mainContent.style.transition = 'opacity 1s ease-in-out';
      }
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div 
      id="preloader"
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: '#252627' }}
    >
      <Image 
        src="https://gifdb.com/images/high/blue-fire-498-x-498-gif-wnffgxmn5h3b7dkg.webp" 
        alt="Loading..." 
        width={300} 
        height={300} 
        unoptimized 
      />
    </div>
  );
}
