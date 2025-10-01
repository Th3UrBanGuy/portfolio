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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { updateTitle } from '../actions';

const formSchema = z.object({
  pageTitle: z.string().min(1, "Page title is required."),
  tocTitle: z.string().min(1, "Table of Contents title is required."),
});

type TitleFormValues = z.infer<typeof formSchema>;

export function TitleForm({ pageTitle, tocTitle }: { pageTitle: string, tocTitle: string }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<TitleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pageTitle: pageTitle,
      tocTitle: tocTitle,
    },
  });

  function onSubmit(values: TitleFormValues) {
    startTransition(async () => {
      const result = await updateTitle(values);
      if (result.success) {
        toast({
          title: 'Title Updated',
          description: 'The page titles have been saved.',
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Page & ToC Titles</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <FormField
                        control={form.control}
                        name="pageTitle"
                        render={({ field }) => (
                            <FormItem className="flex-grow">
                            <FormLabel>Page Title</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tocTitle"
                        render={({ field }) => (
                            <FormItem className="flex-grow">
                            <FormLabel>Table of Contents Title</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" disabled={isPending} className="self-end">
                    <Save className="mr-2" />
                    {isPending ? 'Saving...' : 'Save Titles'}
                </Button>
            </CardContent>
        </Card>
      </form>
    </Form>
  );
}
