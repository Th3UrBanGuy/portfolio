'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Education } from '@/lib/types';
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
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateEducation } from './actions';
import { useTransition } from 'react';

const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution name is required."),
  session: z.string().min(1, "Session is required."),
  details: z.string().min(1, "Details are required."),
});

const formSchema = z.object({
  education: z.array(educationSchema),
});

type EducationFormValues = z.infer<typeof formSchema>;

export function EducationForm({ data }: { data: Education[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      education: data,
    },
  });

  const { fields, append, remove, swap } = useFieldArray({
    control: form.control,
    name: 'education',
  });

  function onSubmit(values: EducationFormValues) {
    startTransition(async () => {
      const result = await updateEducation(values.education);
      if (result.success) {
        toast({
          title: 'Education Updated',
          description: 'Your education details have been saved.',
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

  const addNewInstitution = () => {
    append({
      id: `new-${Date.now()}`,
      institution: '',
      session: '',
      details: '',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
                <CardHeader className='flex-row items-center justify-between'>
                    <CardTitle>Institution #{index + 1}</CardTitle>
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
                  name={`education.${index}.institution`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name={`education.${index}.session`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Session / Year</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., 2023-2027" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name={`education.${index}.details`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Details / Degree</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., BSC in CSE" />
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
            <Button type="button" variant="outline" onClick={addNewInstitution}>
                <Plus className="mr-2" />
                Add Institution
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
