'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { ShortLink } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const formSchema = z.object({
  id: z.string().optional(),
  path: z.string().min(1, 'Path is required. Use "/" for root.').regex(/^[a-zA-Z0-9_-]*$|\/$/, 'Path can only contain letters, numbers, hyphens, and underscores, or be a single "/"'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters.')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Slug can only contain letters, numbers, hyphens, and underscores.'),
  destination: z.string().url('Please enter a valid URL.'),
});

type LinkFormValues = z.infer<typeof formSchema>;

type LinkFormProps = {
  existingLink: ShortLink | null;
  onSave: (values: LinkFormValues) => void;
  isSaving: boolean;
};

export function LinkForm({ existingLink, onSave, isSaving }: LinkFormProps) {
  const form = useForm<LinkFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: existingLink?.id || undefined,
      path: existingLink?.path || 'links',
      slug: existingLink?.slug || '',
      destination: existingLink?.destination || '',
    },
  });

  useEffect(() => {
    form.reset({
      id: existingLink?.id || undefined,
      path: existingLink?.path || 'links',
      slug: existingLink?.slug || '',
      destination: existingLink?.destination || '',
    });
  }, [existingLink, form]);

  const pathValue = form.watch('path');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination URL</FormLabel>
              <FormControl>
                <Input placeholder="https://your-very-long-url.com/goes/here" {...field} />
              </FormControl>
              <FormDescription>The original, long URL you want to shorten.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="path"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Custom Path</FormLabel>
                <FormControl>
                    <Input placeholder="links" {...field} />
                </FormControl>
                <FormDescription>e.g., `go` or `promo`. Use `/` for root.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Custom Slug</FormLabel>
                <div className="flex items-center">
                    <span className="text-muted-foreground p-2 rounded-l-md border border-r-0 bg-muted text-xs truncate max-w-[100px]">
                        /{pathValue}/
                    </span>
                    <FormControl>
                    <Input placeholder="my-link" {...field} className="rounded-l-none"/>
                    </FormControl>
                </div>
                 <FormDescription>The memorable part of the URL.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {existingLink ? 'Save Changes' : 'Create Link'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
