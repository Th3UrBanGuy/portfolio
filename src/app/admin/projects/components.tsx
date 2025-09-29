'use client';

import { useForm, useFieldArray } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateProjects } from './actions';
import { useTransition } from 'react';

const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required."),
  short_description: z.string().min(1, "Short description is required."),
  image_url: z.string().min(1, "Image URL is required."),
  full_description: z.string().min(1, "Full description is required."),
  technologies: z.array(z.string()).min(1, "At least one technology is required."),
  preview_link: z.string().url("Must be a valid URL."),
  documentation_link: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
  category: z.string().min(1, "Category is required."),
});

const formSchema = z.object({
  projects: z.array(projectSchema),
});

type ProjectsFormValues = z.infer<typeof formSchema>;
type ProjectData = z.infer<typeof projectSchema>;

export function ProjectsForm({ data }: { data: ProjectData[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProjectsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projects: data,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'projects',
  });

  function onSubmit(values: ProjectsFormValues) {
    startTransition(async () => {
      const result = await updateProjects(values.projects);
      if (result.success) {
        toast({
          title: 'Projects Updated',
          description: 'Your project list has been saved.',
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

  const addNewProject = () => {
    append({
      id: `new-${Date.now()}`,
      title: '',
      short_description: '',
      image_url: '',
      full_description: '',
      technologies: [],
      preview_link: '',
      documentation_link: '',
      category: '',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className='flex-row items-center justify-between'>
                <CardTitle>Project #{index + 1}</CardTitle>
                <Button variant="ghost" size="icon" type="button" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Remove</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`projects.${index}.title`}
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
                  name={`projects.${index}.short_description`}
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
                  name={`projects.${index}.full_description`}
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
                <FormField
                  control={form.control}
                  name={`projects.${index}.image_url`}
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                          <Input {...field} placeholder="e.g., /project-image.png" />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name={`projects.${index}.technologies`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies (comma-separated)</FormLabel>
                      <FormControl>
                        <Input 
                            {...field} 
                            value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                            onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                            placeholder="Next.js, React, TypeScript"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name={`projects.${index}.preview_link`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Preview Link</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="https://example.com/preview" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name={`projects.${index}.documentation_link`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Documentation Link (Optional)</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="https://example.com/docs" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                 <FormField
                  control={form.control}
                  name={`projects.${index}.category`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category / Bundle</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Featured Projects" />
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
          <Button type="button" variant="outline" onClick={addNewProject}>
            <Plus className="mr-2" />
            Add Project
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
