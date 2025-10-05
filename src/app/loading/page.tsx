'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Rocket, Zap, Atom } from 'lucide-react';
import { cn } from '@/lib/utils';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { LinkSettings } from '@/lib/types';
import Image from 'next/image';

const icons = [ShieldCheck, Rocket, Zap, Atom];

const LoadingScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = searchParams.get('destination');
  const text = searchParams.get('text') || 'Redirecting...';
  const duration = parseInt(searchParams.get('duration') || '3', 10);
  
  const [progress, setProgress] = useState(0);
  const [settings, setSettings] = useState<LinkSettings | null>(null);


  useEffect(() => {
    async function fetchSettings() {
        const settingsDoc = await getDoc(doc(db, 'site-data', 'link-shortener-settings'));
        if (settingsDoc.exists()) {
            setSettings(settingsDoc.data() as LinkSettings);
        }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!destination) {
      router.push('/'); // Redirect to home if no destination is provided
      return;
    }

    const durationMs = duration * 1000;
    const intervalTime = 50;
    const steps = durationMs / intervalTime;
    const increment = 100 / steps;

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + increment, 100));
    }, intervalTime);

    const redirectTimeout = setTimeout(() => {
      window.location.href = destination;
    }, durationMs);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(redirectTimeout);
    };
  }, [destination, duration, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white font-mono p-4"
         style={{
            backgroundImage: 'radial-gradient(circle at center, hsl(224, 71%, 10%), hsl(224, 71%, 4%)), url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
         }}
    >
      <div className="w-full max-w-xl text-center">
        <div className="relative inline-block mb-8">
          {icons.map((Icon, i) => (
            <Icon
              key={i}
              className="absolute text-cyan-400/50"
              style={{
                opacity: 0.3,
                width: `${20 + i * 20}px`,
                height: `${20 + i * 20}px`,
                transform: `rotate(${i * 90}deg) translate(${80 + i * 20}px)`,
                animation: `spin-reverse ${5 + i * 2}s linear infinite`,
              }}
            />
          ))}
          <div className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-[0_0_20px_theme(colors.cyan.400),inset_0_0_20px_theme(colors.cyan.400)]">
             <div className='w-20 h-20 text-cyan-400 flex items-center justify-center'>
                {settings?.loadingScreenImageUrl ? (
                    <Image src={settings.loadingScreenImageUrl} alt="Loading Screen Icon" width={80} height={80} className="rounded-full object-cover animate-pulse-glow" />
                ) : (
                    <ShieldCheck className="w-20 h-20 animate-pulse-glow" />
                )}
             </div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-cyan-300 uppercase tracking-widest mb-4" style={{ textShadow: '0 0 10px theme(colors.cyan.300)' }}>
            {text}
        </h1>
        
        <div className="w-full bg-gray-700/50 rounded-full h-2.5">
          <div
            className="bg-cyan-400 h-2.5 rounded-full shadow-[0_0_10px_theme(colors.cyan.400)] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
