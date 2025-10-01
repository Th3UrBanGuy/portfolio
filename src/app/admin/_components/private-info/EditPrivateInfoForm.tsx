'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { PrivateInfo } from '@/lib/types';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { updatePrivateInfo } from '@/app/admin/private-info/actions';
import { useToast } from '@/hooks/use-toast';

const customFieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Label is required."),
  value: z.string().min(1, "Value is required."),
  isSecret: z.boolean(),
});

const privateDocumentSchema = z.object({
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

const formSchema = z.object({
  sections: z.array(privateInfoSectionSchema),
  documents: z.array(privateDocumentSchema),
});

type EditPrivateInfoFormProps = {
  initialData: PrivateInfo;
};

export default function EditPrivateInfoForm({ initialData }: EditPrivateInfoFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  const { fields: documentFields, append: appendDocument, remove: removeDocument } = useFieldArray({
    control: form.control,
    name: "documents",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await updatePrivateInfo(values);
    if (result.success) {
      toast({
        title: "Private Info Updated",
        description: "Your private information has been saved.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Custom Information Sections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {sectionFields.map((section, sectionIndex) => (
              <Card key={section.id}>
                <CardHeader className="flex-row items-center justify-between">
                  <FormField
                    control={form.control}
                    name={`sections.${sectionIndex}.title`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel>Section Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Family Information" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button variant="ghost" size="icon" type="button" onClick={() => removeSection(sectionIndex)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <FieldsArray control={form.control} sectionIndex={sectionIndex} />
                </CardContent>
              </Card>
            ))}
            <Button type="button" variant="outline" onClick={() => appendSection({ id: `new-section-${Date.now()}`, title: '', fields: [] })}>
              <Plus className="mr-2" />
              Add Section
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {documentFields.map((doc, docIndex) => (
              <Card key={doc.id}>
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className='text-lg'>Document #{docIndex + 1}</CardTitle>
                    <Button variant="ghost" size="icon" type="button" onClick={() => removeDocument(docIndex)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name={`documents.${docIndex}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Passport" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`documents.${docIndex}.icon_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., FileText" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="md:col-span-2">
                    <FormField
                        control={form.control}
                        name={`documents.${docIndex}.url`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                            <Input {...field} placeholder="https://example.com/document.pdf" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button type="button" variant="outline" onClick={() => appendDocument({ id: `new-doc-${Date.now()}`, label: '', url: '', icon_name: '' })}>
              <Plus className="mr-2" />
              Add Document
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => form.reset(initialData)} disabled={form.formState.isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}

function FieldsArray({ control, sectionIndex }: { control: any, sectionIndex: number }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `sections.${sectionIndex}.fields`
    });

    return (
        <div className="space-y-4">
            {fields.map((field, fieldIndex) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-4 items-end">
                     <FormField
                        control={control}
                        name={`sections.${sectionIndex}.fields.${fieldIndex}.label`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                            <Input {...field} placeholder="e.g., Father's Name" />
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
                            <Input {...field} placeholder="John Doe" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name={`sections.${sectionIndex}.fields.${fieldIndex}.isSecret`}
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-start">
                                <FormLabel>Secret</FormLabel>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={(value) => setTimeout(() => field.onChange(value), 0)} />
                                </FormControl>
                            </FormItem>
                        )}
                        />
                    <Button variant="ghost" size="icon" type="button" onClick={() => remove(fieldIndex)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ id: `new-field-${Date.now()}`, label: '', value: '', isSecret: false })}>
                <Plus className="mr-2 h-4 w-4" />
                Add Field
            </Button>
        </div>
    )
}
