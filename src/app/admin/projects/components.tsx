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

export function ProjectsForm({ data, bundles }: { data: ProjectData[], bundles: string[] }) {
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

const bundleFormSchema = z.object({
  newBundle: z.string().min(1, 'Bundle name cannot be empty.'),
});

export function BundleManager({ bundles }: { bundles: string[] }) {
  const form = useForm({
    resolver: zodResolver(bundleFormSchema),
    defaultValues: { newBundle: '' },
  });

  function onSubmit(values: z.infer<typeof bundleFormSchema>) {
    console.log('Adding new bundle:', values.newBundle);
    // Here you would call a server action to add the new bundle
    form.reset();
  }

  function onRemove(bundle: string) {
    console.log('Removing bundle:', bundle);
    // Here you would call a server action to remove the bundle
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
          <FormField
            control={form.control}
            name="newBundle"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormLabel className="sr-only">New Bundle</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter new bundle name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            <Plus className="mr-2" />
            Add Bundle
          </Button>
        </form>
      </Form>

      <Separator />

      <div>
        <h4 className="mb-4 text-lg font-medium">Existing Bundles</h4>
        {bundles.length > 0 ? (
          <div className="space-y-2">
            {bundles.map(bundle => (
                <div key={bundle} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{bundle}</span>
                    </div>
                     <Button variant="ghost" size="icon" onClick={() => onRemove(bundle)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Remove {bundle}</span>
                    </Button>
                </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No bundles found. Add one above to get started.</p>
        )}
      </div>
    </div>
  );
}
