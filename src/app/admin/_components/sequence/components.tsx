'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { updateSequence } from './actions';
import { Page, pageConfig, PageSequence } from '@/lib/types';
import { PageSchema } from '@/lib/schemas/page';
import { Switch } from '@/components/ui/switch';

const sequenceSchema = z.object({
  activePages: z.array(z.object({ pageId: PageSchema })),
  hiddenPages: z.array(z.object({ pageId: PageSchema })),
});

type SequenceFormValues = z.infer<typeof sequenceSchema>;

export function SequenceForm({ initialSequence }: { initialSequence: PageSequence }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SequenceFormValues>({
    resolver: zodResolver(sequenceSchema),
    defaultValues: {
      activePages: initialSequence.activePages.map(pageId => ({ pageId })),
      hiddenPages: initialSequence.hiddenPages.map(pageId => ({ pageId })),
    },
  });

  const { fields: activePages, move: moveActive, remove: removeActive, append: appendActive } = useFieldArray({
    control: form.control,
    name: "activePages",
  });

  const { fields: hiddenPages, remove: removeHidden, append: appendHidden } = useFieldArray({
    control: form.control,
    name: "hiddenPages",
  });

  const handleToggleVisibility = (page: { pageId: Page }, index: number, isActive: boolean) => {
    if (isActive) {
      const item = activePages[index];
      removeActive(index);
      appendHidden(item);
    } else {
      const item = hiddenPages[index];
      removeHidden(index);
      appendActive(item);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    moveActive(index, direction === 'up' ? index - 1 : index + 1);
    form.setValue('activePages', form.getValues('activePages'), { shouldDirty: true });
  };

  function onSubmit(values: SequenceFormValues) {
    const plainValues: PageSequence = {
      activePages: values.activePages.map(p => p.pageId),
      hiddenPages: values.hiddenPages.map(p => p.pageId),
    };
    startTransition(() => {
      updateSequence(plainValues)
        .then((result) => {
          if (result?.success) {
            toast({
              title: 'Sequence Updated',
              description: 'The page order has been saved successfully.',
            });
            form.reset(values);
          } else {
            toast({
              title: 'Error',
              description: result?.error || 'An unexpected error occurred.',
              variant: 'destructive',
            });
          }
        })
        .catch((error) => {
          console.error('Failed to update sequence:', error);
          toast({
            title: 'Error',
            description: 'An unexpected error occurred while updating the sequence.',
            variant: 'destructive',
          });
        });
    });
  }

  const watchedActivePages = form.watch('activePages');

  const firstMovableIndex = watchedActivePages.findIndex(p => p && p.pageId && !pageConfig[p.pageId].isFixed);
  const lastMovableIndex = watchedActivePages.length - 1 - [...watchedActivePages].reverse().findIndex(p => p && p.pageId && !pageConfig[p.pageId].isFixed);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Visible Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {activePages.map((page, index) => {
                const config = pageConfig[page.pageId];
                const isMovable = !config.isFixed;
                const Icon = config.icon;
                return (
                  <li key={page.id} className={`flex items-center p-3 rounded-lg border transition-shadow ${isMovable ? 'bg-background hover:shadow-md' : 'cursor-not-allowed bg-muted text-muted-foreground'}`}>
                    <div className="flex items-center gap-3 flex-grow">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{config.label}</span>
                    </div>
                    {isMovable && (
                      <div className="flex items-center gap-1">
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleMove(index, 'up')} disabled={index === firstMovableIndex || isPending}><ArrowUp className="h-4 w-4" /></Button>
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleMove(index, 'down')} disabled={index === lastMovableIndex || isPending}><ArrowDown className="h-4 w-4" /></Button>
                        <Switch checked={true} onCheckedChange={() => handleToggleVisibility(page, index, true)} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hidden Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {hiddenPages.map((page, index) => {
                const config = pageConfig[page.pageId];
                const Icon = config.icon;
                return (
                  <li key={page.id} className="flex items-center p-3 rounded-lg border bg-muted text-muted-foreground">
                    <div className="flex items-center gap-3 flex-grow">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{config.label}</span>
                    </div>
                    <Switch checked={false} onCheckedChange={() => handleToggleVisibility(page, index, false)} />
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || !form.formState.isDirty}>
          <Save className="mr-2" />
          {isPending ? 'Saving...' : 'Save Sequence'}
        </Button>
      </div>
    </form>
  );
}