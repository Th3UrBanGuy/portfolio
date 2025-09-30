'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Save, GripVertical } from 'lucide-react';
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

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.dataTransfer.setData('draggedIndex', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>, dropIndex: number) => {
    const draggedIndex = parseInt(e.dataTransfer.getData('draggedIndex'), 10);
    const newSequence = [...sequence];
    const [draggedItem] = newSequence.splice(draggedIndex, 1);
    newSequence.splice(dropIndex, 0, draggedItem);
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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
                The first and last pages (Cover and Back Cover) are fixed. Drag the pages in between to set your desired order.
            </p>
          <ul className="space-y-2">
            {sequence.map((pageId, index) => {
              const config = pageConfig[pageId];
              const isDraggable = !config.isFixed;
              const Icon = config.icon;

              return (
                <li
                  key={pageId}
                  draggable={isDraggable}
                  onDragStart={isDraggable ? (e) => handleDragStart(e, index) : undefined}
                  onDragOver={isDraggable ? handleDragOver : undefined}
                  onDrop={isDraggable ? (e) => handleDrop(e, index) : undefined}
                  className={`flex items-center p-3 rounded-lg border transition-shadow ${
                    isDraggable
                      ? 'cursor-grab bg-background hover:shadow-md'
                      : 'cursor-not-allowed bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-grow">
                    {isDraggable && <GripVertical className="h-5 w-5 text-muted-foreground" />}
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{config.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {config.isFixed ? (index === 0 ? 'First Page' : 'Last Page') : `Position ${index}`}
                  </span>
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
