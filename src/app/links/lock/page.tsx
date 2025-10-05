'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { verifyPassword } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Fingerprint, Loader2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import type { LinkSettings } from '@/lib/types';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-cyan-400/20 border-cyan-400 border text-cyan-300 hover:bg-cyan-400/30 hover:text-cyan-200">
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...</> : 'Unlock'}
    </Button>
  );
}

const animationSteps = [
    { text: 'Accessing Content...', duration: 1500 },
    { text: 'Decrypting Data...', duration: 2000 },
    { text: 'Exploring...', duration: 1500 },
    { text: 'Redirecting...', duration: 1000 },
];

function LockForm({ onUnlockSuccess }: { onUnlockSuccess: (destination: string) => void }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [state, formAction, isPending] = useActionState(verifyPassword, null);
    
    const id = searchParams.get('id');
    const destinationB64 = searchParams.get('destination_b64');

     useEffect(() => {
        if (state?.success && state.destination) {
            onUnlockSuccess(state.destination);
        }
    }, [state, onUnlockSuccess]);

    if (!id || !destinationB64) {
        // In a real app, you might want to redirect to an error page or home
        if (typeof window !== 'undefined') {
            router.push('/');
        }
        return <div className='text-red-500'>Error: Missing required link information.</div>;
    }
    
    return (
        <form action={formAction} className="space-y-4">
             <input type="hidden" name="id" value={id || ''} />
            <input type="hidden" name="destination_b64" value={destinationB64 || ''} />

            <div className="relative">
                <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-400/50" />
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter Access Key"
                    required
                    className="w-full bg-gray-800/50 border-cyan-400/30 text-cyan-300 placeholder:text-cyan-400/40 pl-10 focus:ring-cyan-400"
                    disabled={isPending}
                />
            </div>
            {state?.error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}
            <SubmitButton />
        </form>
    );
}

export default function LockPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [animationText, setAnimationText] = useState('');
    const [destinationUrl, setDestinationUrl] = useState('');
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

    const handleUnlockSuccess = (destination: string) => {
        setIsUnlocked(true);
        setDestinationUrl(destination);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const rainDrops: number[] = [];

        for (let x = 0; x < columns; x++) {
            rainDrops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#0fa';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    useEffect(() => {
        if (isUnlocked) {
            let currentStep = 0;
            const runAnimation = () => {
                if (currentStep < animationSteps.length) {
                    setAnimationText(animationSteps[currentStep].text);
                    setTimeout(() => {
                        currentStep++;
                        runAnimation();
                    }, animationSteps[currentStep].duration);
                } else {
                    window.location.href = destinationUrl;
                }
            };
            runAnimation();
        }
    }, [isUnlocked, destinationUrl]);


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4 font-mono relative overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-30"></canvas>
        <div className="absolute inset-0 bg-grid-cyan-500/10 [mask-image:linear-gradient(to_bottom,white_0%,white_75%,transparent_100%)]"></div>

        <div className="relative z-10 w-full max-w-md rounded-lg bg-gray-800/30 p-8 shadow-[0_0_30px_theme(colors.cyan.500/0.3)] backdrop-blur-sm transition-all duration-500 animate-in fade-in-0 zoom-in-95">
            <div className={cn("transition-opacity duration-500", isUnlocked ? 'opacity-0 h-0' : 'opacity-100')}>
                <div className="text-center mb-6">
                    <div className="mx-auto h-16 w-16 text-cyan-400 flex items-center justify-center">
                        {settings?.lockScreenImageUrl ? (
                            <Image src={settings.lockScreenImageUrl} alt="Lock Screen Icon" width={64} height={64} className="rounded-full object-cover animate-pulse-glow" />
                        ) : (
                            <Fingerprint className="h-16 w-16 animate-pulse-glow" />
                        )}
                    </div>
                    <h1 className="text-2xl font-bold text-cyan-300 mt-4 tracking-wider" style={{ textShadow: '0 0 8px theme(colors.cyan.400/0.8)' }}>
                        Secure Access Required
                    </h1>
                    <p className="text-sm text-cyan-400/60 mt-2">
                        This link is protected. Please verify your credentials.
                    </p>
                </div>
                <LockForm onUnlockSuccess={handleUnlockSuccess} />
            </div>

             <div className={cn("text-center transition-all duration-500 flex flex-col items-center justify-center", !isUnlocked ? 'opacity-0 h-0' : 'opacity-100 min-h-[280px]')}>
                <h1 className="text-2xl font-bold text-cyan-300 mt-4 tracking-wider" style={{ textShadow: '0 0 8px theme(colors.cyan.400/0.8)' }}>
                    {animationText}
                </h1>
                <Loader2 className="mt-8 h-16 w-16 text-cyan-400 animate-spin" />
            </div>
        </div>
    </div>
  );
}
