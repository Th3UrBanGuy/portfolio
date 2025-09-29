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
  title: z.string().min(1, "Page title is required."),
});

type TitleFormValues = z.infer<typeof formSchema>;

export function TitleForm({ title }: { title: string }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<TitleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: title,
    },
  });

  function onSubmit(values: TitleFormValues) {
    startTransition(async () => {
      const result = await updateTitle(values.title);
      if (result.success) {
        toast({
          title: 'Title Updated',
          description: 'The page title has been saved.',
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
                <CardTitle>Page Title</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="flex-grow">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending} className="mt-8">
                    <Save className="mr-2" />
                    {isPending ? 'Saving...' : 'Save'}
                </Button>
            </CardContent>
        </Card>
      </form>
    </Form>
  );
}
