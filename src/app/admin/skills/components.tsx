'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Skill } from '@/lib/types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { updateSkills } from './actions';

const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Skill name is required."),
  icon: z.string().min(1, "Icon is required."),
  description: z.string().min(1, "Description is required."),
  category: z.string().min(1, "Category is required."),
});

const formSchema = z.object({
  skills: z.array(skillSchema),
});

type SkillsFormValues = z.infer<typeof formSchema>;

type SkillsFormProps = {
    skills: Skill[];
    categories: string[];
    onSave: (data: SkillsFormValues) => Promise<{success: boolean, error?: string}|undefined>;
}

export function SkillsForm({ skills, categories, onSave }: SkillsFormProps) {
  const { toast } = useToast();

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: skills,
    },
  });

    // Watch for changes to the skills array to update the UI
    React.useEffect(() => {
        form.reset({ skills });
    }, [skills, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'skills',
  });

  async function onSubmit(values: SkillsFormValues) {
    const result = await onSave(values);
    if (result?.success) {
      toast({
        title: 'Skills Updated',
        description: 'Your skills list has been saved.',
      });
    } else if (result?.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
  }

  const addNewSkill = () => {
    append({
      id: `new-${Date.now()}`,
      name: '',
      icon: '',
      description: '',
      category: categories[0] || 'New Category',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className='flex-row items-center justify-between'>
                <CardTitle>Skill #{index + 1}</CardTitle>
                <Button variant="ghost" size="icon" type="button" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Remove</span>
                </Button>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name={`skills.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., JavaScript" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`skills.${index}.icon`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Code" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name={`skills.${index}.category`}
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {categories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                             <SelectItem value="New Category">--- Create New ---</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-2">
                    <FormField
                    control={form.control}
                    name={`skills.${index}.description`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea {...field} placeholder="A short description of the skill" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center">
            <Button type="button" variant="outline" onClick={addNewSkill}>
                <Plus className="mr-2" />
                Add Skill
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
                <Save className="mr-2" />
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
        </div>
      </form>
    </Form>
  );
}

export function CategoryManager({ categories }: { categories: string[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-4 text-lg font-medium">Existing Categories</h4>
        <p className="text-sm text-muted-foreground mb-4">
            Categories are created automatically when you assign a skill to a new category name in the Skill Management view. To remove a category, ensure no skills are assigned to it.
        </p>
        {categories.length > 0 ? (
          <div className="space-y-2">
            {categories.map(category => (
                <div key={category} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{category}</span>
                    </div>
                </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No categories found. Add a skill and assign it a category to get started.</p>
        )}
      </div>
    </div>
  );
}
