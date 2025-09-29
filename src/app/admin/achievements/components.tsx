'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Achievement } from '@/lib/types';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateAchievements } from './actions';
import { useTransition } from 'react';

const achievementSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required."),
  short_description: z.string().min(1, "Short description is required."),
  full_description: z.string().min(1, "Full description is required."),
  icon_url: z.string().min(1, "Icon URL is required."),
  certificate_image_url: z.string().url("Must be a valid URL."),
  how_achieved: z.string().min(1, "This field is required."),
  words_about_it: z.string().min(1, "This field is required."),
});

const formSchema = z.object({
  achievements: z.array(achievementSchema),
});

type AchievementsFormValues = z.infer<typeof formSchema>;

export function AchievementsForm({ data }: { data: Achievement[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<AchievementsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      achievements: data,
    },
  });

  const { fields, append, remove, swap } = useFieldArray({
    control: form.control,
    name: 'achievements',
  });

  function onSubmit(values: AchievementsFormValues) {
    startTransition(async () => {
      const result = await updateAchievements(values.achievements);
      if (result.success) {
        toast({
          title: 'Achievements Updated',
          description: 'Your list of achievements has been saved.',
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

  const addNewAchievement = () => {
    append({
      id: `new-${Date.now()}`,
      title: '',
      short_description: '',
      full_description: '',
      icon_url: '',
      certificate_image_url: '',
      how_achieved: '',
      words_about_it: '',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className='flex-row items-center justify-between'>
                <CardTitle>Achievement #{index + 1}</CardTitle>
                 <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" type="button" onClick={() => swap(index, index - 1)} disabled={index === 0}>
                    <ArrowUp className="h-4 w-4" />
                    <span className="sr-only">Move Up</span>
                  </Button>
                  <Button variant="ghost" size="icon" type="button" onClick={() => swap(index, index + 1)} disabled={index === fields.length - 1}>
                    <ArrowDown className="h-4 w-4" />
                    <span className="sr-only">Move Down</span>
                  </Button>
                  <Button variant="ghost" size="icon" type="button" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`achievements.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name={`achievements.${index}.short_description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`achievements.${index}.full_description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`achievements.${index}.icon_url`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Icon URL</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g., achievement-icon.png" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name={`achievements.${index}.certificate_image_url`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Certificate Image URL</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="https://example.com/cert.jpg" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name={`achievements.${index}.how_achieved`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How It Was Achieved</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`achievements.${index}.words_about_it`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>My Thoughts</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Button type="button" variant="outline" onClick={addNewAchievement}>
            <Plus className="mr-2" />
            Add Achievement
          </Button>
          <Button type="submit" disabled={isPending}>
            <Save className="mr-2" />
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
