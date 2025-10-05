'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
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
import type { LinkSettings } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const formSchema = z.object({
  lockScreenImageUrl: z.string().url('Must be a valid URL.').or(z.literal('')),
  loadingScreenImageUrl: z.string().url('Must be a valid URL.').or(z.literal('')),
});

type SettingsFormValues = z.infer<typeof formSchema>;

type SettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: SettingsFormValues) => void;
  isSaving: boolean;
  currentSettings: LinkSettings | null;
};

export function SettingsDialog({ open, onOpenChange, onSave, isSaving, currentSettings }: SettingsDialogProps) {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lockScreenImageUrl: currentSettings?.lockScreenImageUrl || '',
      loadingScreenImageUrl: currentSettings?.loadingScreenImageUrl || '',
    },
  });

  useEffect(() => {
    form.reset({
      lockScreenImageUrl: currentSettings?.lockScreenImageUrl || '',
      loadingScreenImageUrl: currentSettings?.loadingScreenImageUrl || '',
    });
  }, [currentSettings, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link Shortener Settings</DialogTitle>
          <DialogDescription>
            Customize the appearance of your link lock and loading screens. Leave fields blank to use defaults.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="lockScreenImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lock Screen Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/lock-icon.png" {...field} />
                  </FormControl>
                  <FormDescription>Image to display on the password lock screen.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loadingScreenImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loading Screen Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/loading-icon.png" {...field} />
                  </FormControl>
                  <FormDescription>Image to display on the custom loading screen.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Settings
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
