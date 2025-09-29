'use client';

import { useForm, useFieldArray, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Experience } from '@/lib/types';
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
import { updateExperience } from './actions';
import { useTransition } from 'react';

const experienceSchema = z.object({
  id: z.string(),
  role: z.string().min(1, "Role is required."),
  company: z.string().min(1, "Company name is required."),
  location: z.string().min(1, "Location is required."),
  duration: z.string().min(1, "Duration is required."),
  short_description: z.string().min(1, "Short description is required."),
  details: z.array(z.string().min(1, "Detail cannot be empty.")).min(1, "At least one detail point is required."),
});

const formSchema = z.object({
  experience: z.array(experienceSchema),
});

type ExperienceFormValues = z.infer<typeof formSchema>;


function DetailsArray({ control, experienceIndex }: { control: Control<ExperienceFormValues>, experienceIndex: number }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `experience.${experienceIndex}.details`
  });

  return (
    <div className="space-y-4 rounded-lg border p-4">
       <div className='flex items-center justify-between'>
        <h4 className="font-medium">Responsibility Details</h4>
         <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append('')}
        >
            <Plus className="mr-2 h-4 w-4" /> Add Detail
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, detailIndex) => (
          <div key={field.id} className="flex items-center gap-2">
            <FormField
              control={control}
              name={`experience.${experienceIndex}.details.${detailIndex}`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input {...field} placeholder={`Detail #${detailIndex + 1}`} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(detailIndex)}
              disabled={fields.length <= 1}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className='sr-only'>Remove Detail</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}


export function ExperienceForm({ data }: { data: Experience[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experience: data,
    },
  });

  const { fields, append, remove, swap } = useFieldArray({
    control: form.control,
    name: 'experience',
  });

  function onSubmit(values: ExperienceFormValues) {
    startTransition(async () => {
      const result = await updateExperience(values.experience);
      if (result.success) {
        toast({
          title: 'Experience Updated',
          description: 'Your professional experience has been saved.',
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

  const addNewExperience = () => {
    append({
      id: `new-${Date.now()}`,
      role: '',
      company: '',
      location: '',
      duration: '',
      short_description: '',
      details: [''],
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className='flex-row items-center justify-between'>
                <CardTitle>Experience #{index + 1}</CardTitle>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name={`experience.${index}.role`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Role / Title</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name={`experience.${index}.company`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name={`experience.${index}.location`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g., Remote" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name={`experience.${index}.duration`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g., 2024 - Present" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                 <FormField
                  control={form.control}
                  name={`experience.${index}.short_description`}
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
                <DetailsArray control={form.control} experienceIndex={index} />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Button type="button" variant="outline" onClick={addNewExperience}>
            <Plus className="mr-2" />
            Add Experience
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

    