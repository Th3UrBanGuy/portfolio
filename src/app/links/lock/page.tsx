'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { verifyPassword } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Fingerprint, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-cyan-400/20 border-cyan-400 border text-cyan-300 hover:bg-cyan-400/30 hover:text-cyan-200">
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...</> : 'Unlock'}
    </Button>
  );
}

function LockForm() {
    const searchParams = useSearchParams();
    const [state, formAction] = useActionState(verifyPassword, null);

    const id = searchParams.get('id');
    const destinationB64 = searchParams.get('destination_b64');
    
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

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: any[] = [];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 1.5 + 0.5,
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4 font-mono relative overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20"></canvas>
         <div className="absolute inset-0 bg-grid-cyan-500/10 [mask-image:linear-gradient(to_bottom,white_0%,white_75%,transparent_100%)]"></div>


        <div className="relative z-10 w-full max-w-md rounded-lg border border-cyan-400/30 bg-gray-800/30 p-8 shadow-[0_0_30px_theme(colors.cyan.500/0.3)] backdrop-blur-sm">
            <div className="text-center mb-6">
                <Fingerprint className="mx-auto h-16 w-16 text-cyan-400 animate-pulse-glow" />
                <h1 className="text-2xl font-bold text-cyan-300 mt-4 tracking-wider" style={{ textShadow: '0 0 8px theme(colors.cyan.400/0.8)' }}>
                    Secure Access Required
                </h1>
                <p className="text-sm text-cyan-400/60 mt-2">
                    This link is protected. Please verify your credentials.
                </p>
            </div>
            <LockForm />
        </div>
    </div>
  );
}
