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
import { Save, Plus, Trash2, Tag, Edit, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addBundle, updateBundle, deleteBundle } from './actions';
import { useTransition, useState, useOptimistic } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Project, ProjectBundle } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  category: z.string(), // Can be empty for individual projects
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

export function ProjectsForm({ data, bundles, onSave }: { data: Project[], bundles: ProjectBundle[], onSave: (data: any) => Promise<any> }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProjectsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projects: data.map(p => ({ ...p, category: p.category || '__individual__' })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'projects',
  });

  function onSubmit(values: ProjectsFormValues) {
    startTransition(async () => {
      const result = await onSave(values.projects);
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
      category: bundles[0]?.name || '__individual__',
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
                              <SelectItem value="__individual__">No Bundle (Individual)</SelectItem>
                            {bundles.map(bundle => (
                                <SelectItem key={bundle.id} value={bundle.name}>{bundle.name}</SelectItem>
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


export function BundleManager({ initialBundles }: { initialBundles: ProjectBundle[] }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [newBundleName, setNewBundleName] = useState('');
    const [editingBundle, setEditingBundle] = useState<{ id: string; name: string } | null>(null);
    const [deletingBundleId, setDeletingBundleId] = useState<string | null>(null);

    const [optimisticBundles, setOptimisticBundles] = useOptimistic(
        initialBundles,
        (state, { type, bundle }: { type: 'add' | 'update' | 'delete', bundle: ProjectBundle }) => {
            switch (type) {
                case 'add':
                    return [...state, bundle];
                case 'update':
                    return state.map(b => b.id === bundle.id ? bundle : b);
                case 'delete':
                    return state.filter(b => b.id !== bundle.id);
                default:
                    return state;
            }
        }
    );

    const handleAddBundle = () => {
        if (!newBundleName.trim()) {
            toast({ title: 'Error', description: 'Bundle name cannot be empty.', variant: 'destructive' });
            return;
        }
        const tempId = `temp-${Date.now()}`;
        const newBundle = { id: tempId, name: newBundleName.trim() };

        startTransition(async () => {
            setOptimisticBundles({ type: 'add', bundle: newBundle });
            const result = await addBundle(newBundle.name);
            if (result.success) {
                toast({ title: 'Bundle Added' });
                setNewBundleName('');
            } else {
                toast({ title: 'Error', description: result.error, variant: 'destructive' });
            }
        });
    };

    const handleUpdateBundle = () => {
        if (!editingBundle || !editingBundle.name.trim()) return;
        
        const originalBundle = initialBundles.find(b => b.id === editingBundle.id);
        if (originalBundle?.name === editingBundle.name) {
            setEditingBundle(null);
            return;
        }

        startTransition(async () => {
            setOptimisticBundles({ type: 'update', bundle: editingBundle });
            const result = await updateBundle(editingBundle.id, editingBundle.name);
             if (result.success) {
                toast({ title: 'Bundle Updated' });
            } else {
                toast({ title: 'Error', description: result.error, variant: 'destructive' });
            }
            setEditingBundle(null);
        });
    };
    
    const handleDeleteBundle = (id: string) => {
        startTransition(async () => {
            setOptimisticBundles({ type: 'delete', bundle: { id, name: '' } });
            const result = await deleteBundle(id);
             if (result.success) {
                toast({ title: 'Bundle Deleted' });
            } else {
                toast({ title: 'Error', description: result.error, variant: 'destructive' });
            }
            setDeletingBundleId(null);
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                <Input
                    value={newBundleName}
                    onChange={(e) => setNewBundleName(e.target.value)}
                    placeholder="New bundle name..."
                    disabled={isPending}
                />
                <Button onClick={handleAddBundle} disabled={isPending}>
                    <Plus className="mr-2" /> Add
                </Button>
            </div>
            <div className="space-y-2">
                {optimisticBundles.map(bundle => (
                    <div key={bundle.id} className="flex items-center justify-between rounded-lg border p-3">
                        {editingBundle?.id === bundle.id ? (
                            <Input
                                value={editingBundle.name}
                                onChange={(e) => setEditingBundle({ ...editingBundle, name: e.target.value })}
                                className="h-8"
                                autoFocus
                            />
                        ) : (
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{bundle.name}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            {editingBundle?.id === bundle.id ? (
                                <>
                                    <Button size="icon" variant="ghost" onClick={handleUpdateBundle}><Check className="h-4 w-4 text-green-500" /></Button>
                                    <Button size="icon" variant="ghost" onClick={() => setEditingBundle(null)}><X className="h-4 w-4 text-red-500" /></Button>
                                </>
                            ) : (
                                <>
                                    <Button size="icon" variant="ghost" onClick={() => setEditingBundle(bundle)}><Edit className="h-4 w-4" /></Button>
                                    <Button size="icon" variant="ghost" onClick={() => setDeletingBundleId(bundle.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <AlertDialog open={!!deletingBundleId} onOpenChange={() => setDeletingBundleId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the bundle. Projects in this bundle will become "Individual".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteBundle(deletingBundleId!)} disabled={isPending}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
