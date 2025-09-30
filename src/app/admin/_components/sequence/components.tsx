'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Save, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { updateSequence } from './actions';
import { Page, PageSchema, pageConfig } from '@/lib/types';

const sequenceSchema = z.object({
  sequence: z.array(PageSchema),
});

type SequenceFormValues = z.infer<typeof sequenceSchema>;

export function SequenceForm({ initialSequence }: { initialSequence: Page[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [sequence, setSequence] = useState(initialSequence);

  const form = useForm<SequenceFormValues>({
    resolver: zodResolver(sequenceSchema),
    defaultValues: {
      sequence: initialSequence,
    },
  });

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newSequence = [...sequence];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap elements
    [newSequence[index], newSequence[targetIndex]] = [newSequence[targetIndex], newSequence[index]];

    setSequence(newSequence);
    form.setValue('sequence', newSequence, { shouldValidate: true, shouldDirty: true });
  };


  function onSubmit(values: SequenceFormValues) {
    startTransition(async () => {
      const result = await updateSequence(values);
      if (result.success) {
        toast({
          title: 'Sequence Updated',
          description: 'The page order has been saved successfully.',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  }

  // Find the boundaries for movable items
  const firstMovableIndex = sequence.findIndex(p => !pageConfig[p].isFixed);
  const lastMovableIndex = sequence.length - 1 - [...sequence].reverse().findIndex(p => !pageConfig[p].isFixed);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
                The first and last pages (Cover and Back Cover) are fixed. Use the arrow buttons to reorder the pages in between.
            </p>
          <ul className="space-y-2">
            {sequence.map((pageId, index) => {
              const config = pageConfig[pageId];
              const isMovable = !config.isFixed;
              const Icon = config.icon;

              return (
                <li
                  key={pageId}
                  className={`flex items-center p-3 rounded-lg border transition-shadow ${
                    isMovable
                      ? 'bg-background hover:shadow-md'
                      : 'cursor-not-allowed bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-grow">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{config.label}</span>
                  </div>
                  {isMovable ? (
                     <div className="flex items-center gap-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMove(index, 'up')}
                            disabled={index === firstMovableIndex || isPending}
                        >
                            <ArrowUp className="h-4 w-4" />
                            <span className="sr-only">Move Up</span>
                        </Button>
                         <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMove(index, 'down')}
                            disabled={index === lastMovableIndex || isPending}
                        >
                            <ArrowDown className="h-4 w-4" />
                            <span className="sr-only">Move Down</span>
                        </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                        {index === 0 ? 'Fixed (First Page)' : 'Fixed (Last Page)'}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || !form.formState.isDirty}>
          <Save className="mr-2" />
          {isPending ? 'Saving...' : 'Save Sequence'}
        </Button>
      </div>
    </form>
  );
}
