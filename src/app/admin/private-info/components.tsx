'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { PrivateInfo } from '@/lib/types';
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
import { Save, Plus, Trash2, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updatePrivateInfo } from './actions';
import { useTransition } from 'react';
import { Switch } from '@/components/ui/switch';

const customFieldSchema = z.object({
    id: z.string(),
    label: z.string().min(1, "Label is required."),
    value: z.string().min(1, "Value is required."),
    isSecret: z.boolean(),
});

const documentSchema = z.object({
    id: z.string(),
    label: z.string().min(1, "Document label is required."),
    url: z.string().url("Must be a valid URL."),
    icon_name: z.string().min(1, "Icon name is required."),
});

const privateInfoSectionSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Section title is required."),
    fields: z.array(customFieldSchema),
});

const privateInfoSchema = z.object({
  sections: z.array(privateInfoSectionSchema),
  documents: z.array(documentSchema),
});

type PrivateInfoFormValues = z.infer<typeof privateInfoSchema>;

export function PrivateInfoForm({ data }: { data: PrivateInfo }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<PrivateInfoFormValues>({
    resolver: zodResolver(privateInfoSchema),
    defaultValues: {
      sections: data.sections || [],
      documents: data.documents || [],
    },
  });

  const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  const { fields: documentFields, append: appendDocument, remove: removeDocument } = useFieldArray({
    control: form.control,
    name: "documents",
  });

  function onSubmit(values: PrivateInfoFormValues) {
     startTransition(async () => {
      const result = await updatePrivateInfo(values);
      if (result.success) {
        toast({
          title: 'Private Info Updated',
          description: 'Your private details have been saved.',
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
        <div className="space-y-8">
          {sectionFields.map((section, sectionIndex) => (
            <Card key={section.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <FormField
                  control={form.control}
                  name={`sections.${sectionIndex}.title`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input {...field} className="text-lg font-semibold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSection(sectionIndex)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldsArray sectionIndex={sectionIndex} control={form.control} />
              </CardContent>
            </Card>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendSection({ id: `new-section-${Date.now()}`, title: 'New Section', fields: [] })}
          >
            <Plus className="mr-2" /> Add Section
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Private Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {documentFields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeDocument(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <FormField
                  control={form.control}
                  name={`documents.${index}.label`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., National ID" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`documents.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Link</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/doc.pdf" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`documents.${index}.icon_name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Name (from Lucide)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., FileText" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendDocument({ id: `new-doc-${Date.now()}`, label: '', url: '', icon_name: 'File' })}
            >
              <Plus className="mr-2" /> Add Document
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            <Save className="mr-2" />
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function FieldsArray({ sectionIndex, control }: { sectionIndex: number, control: any }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `sections.${sectionIndex}.fields`
    });

    return (
        <div className="space-y-4">
            {fields.map((field, fieldIndex) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => remove(fieldIndex)}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <FormField
                        control={control}
                        name={`sections.${sectionIndex}.fields.${fieldIndex}.label`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name={`sections.${sectionIndex}.fields.${fieldIndex}.value`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name={`sections.${sectionIndex}.fields.${fieldIndex}.isSecret`}
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Secret</FormLabel>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={() => append({ id: `new-field-${Date.now()}`, label: '', value: '', isSecret: false })}
            >
                <Plus className="mr-2" /> Add Field
            </Button>
        </div>
    );
}
