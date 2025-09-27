'use client';

import type { Skill } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import * as LucideIcons from 'lucide-react';

type SkillDetailDialogProps = {
  skill: Skill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const Icon = ({ name, ...props }: { name: string } & LucideIcons.LucideProps) => {
  const LucideIcon = LucideIcons[name as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
  if (!LucideIcon) return <LucideIcons.Star {...props} />;
  return <LucideIcon {...props} />;
};


export default function SkillDetailDialog({
  skill,
  open,
  onOpenChange,
}: SkillDetailDialogProps) {
  if (!skill) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 !rounded-xl overflow-hidden transform scale-100 transition-all duration-300 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 glass">
        <div className="p-6 relative z-10">
            <DialogHeader className='mb-4 flex flex-col items-center text-center'>
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 border border-primary/20">
                    <Icon name={skill.icon} className="h-8 w-8 text-primary" />
                </div>
                <DialogTitle className="text-xl font-bold text-white">{skill.name}</DialogTitle>
            </DialogHeader>

            <ScrollArea className="h-28">
              <DialogDescription className="text-sm text-muted-foreground pr-4 text-center">
                {skill.description}
              </DialogDescription>
            </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
