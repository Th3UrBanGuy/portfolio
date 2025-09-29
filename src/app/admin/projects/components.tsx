'use client';

import { useForm, useFieldArray, Control } from 'react-hook-form';
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
import { Save, Plus, Trash2, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateProjects } from './actions';
import { useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import type { Project } from '@/lib/types';

const projectLinkSchema = z.object({
  label: z.string().min(1, "Link label is required."),
  url: z.string().url("Must be a valid URL."),
});

const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required."),
  short_description: z.string().min(1, "Short description is required."),
  image_url: z.string().min(1, "Image URL is required."),
  full_description: z.string().min(1, "Full description is required."),
  technologies: z.array(z.string().min(1, "Technology cannot be empty.")).min(1, "At least one technology is required."),
  links: z.array(projectLinkSchema).min(1, "At least one link is required."),
  category: z.string().min(1, "Category is required."),
});

const formSchema = z.object({
  projects: z.array(projectSchema),
});

type ProjectsFormValues = z.infer<typeof formSchema>;

function ProjectLinks({ control, projectIndex }: { control: Control<ProjectsFormValues>, projectIndex: number }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `projects.${projectIndex}.links`
  });

  return (
    <div className='space-y-4 rounded-lg border p-4'>
      <div className='flex items-center justify-between'>
        <h4 className="font-medium">Project Links</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ label: '', url: '' })}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Link
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, linkIndex) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 items-start">
            <FormField
              control={control}
              name={`projects.${projectIndex}.links.${linkIndex}.label`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Label</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Button Label" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`projects.${projectIndex}.links.${linkIndex}.url`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(linkIndex)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className='sr-only'>Remove Link</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}


export function ProjectsForm({ data, bundles }: { data: Project[], bundles: string[] }) {
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
      links: [{ label: 'Live Preview', url: '' }],
      category: bundles[0] || 'New Category',
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
                
                <ProjectLinks control={form.control} projectIndex={index} />
                
                 <FormField
                  control={form.control}
                  name={`projects.${index}.category`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category / Bundle</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a bundle" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {bundles.map(bundle => (
                                <SelectItem key={bundle} value={bundle}>{bundle}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
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


export function BundleManager({ bundles }: { bundles: string[] }) {
    return (
      <div className="space-y-6">
        <div>
          <h4 className="mb-4 text-lg font-medium">Existing Bundles</h4>
           <p className="text-sm text-muted-foreground mb-4">
            Bundles (or categories) are created automatically when you assign a project to a new bundle name in the Project Management view. To remove a bundle, ensure no projects are assigned to it.
          </p>
          {bundles.length > 0 ? (
            <div className="space-y-2">
              {bundles.map(bundle => (
                  <div key={bundle} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{bundle}</span>
                      </div>
                  </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No bundles found. Add a project and assign it a bundle to get started.</p>
          )}
        </div>
      </div>
    );
  }
  