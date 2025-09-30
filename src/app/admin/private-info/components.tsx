'use client';

import { useForm, useFieldArray } from 'react-hook-form';
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
import { Save, Plus, Trash2, Users, MapPin, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updatePrivateInfo } from './actions';
import { useTransition } from 'react';

const documentSchema = z.object({
    id: z.string(),
    label: z.string().min(1, "Document label is required."),
    url: z.string().url("Must be a valid URL."),
    icon_name: z.string().min(1, "Icon name is required."),
});

const privateInfoSchema = z.object({
  father_name: z.string().min(1, "Father's name is required."),
  father_occupation: z.string().min(1, "Father's occupation is required."),
  mother_name: z.string().min(1, "Mother's name is required."),
  mother_occupation: z.string().min(1, "Mother's occupation is required."),
  present_address: z.string().min(1, "Present address is required."),
  permanent_address: z.string().min(1, "Permanent address is required."),
  documents: z.array(documentSchema),
});


type PrivateInfoFormValues = z.infer<typeof privateInfoSchema>;

export function PrivateInfoForm({ data }: { data: PrivateInfo }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<PrivateInfoFormValues>({
    resolver: zodResolver(privateInfoSchema),
    defaultValues: {
      father_name: data.father_name || '',
      father_occupation: data.father_occupation || '',
      mother_name: data.mother_name || '',
      mother_occupation: data.mother_occupation || '',
      present_address: data.present_address || '',
      permanent_address: data.permanent_address || '',
      documents: data.documents || [],
    },
  });

    const { fields, append, remove } = useFieldArray({
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users /> Parental Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                        control={form.control}
                        name="father_name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Father's Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="father_occupation"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Father's Occupation</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="mother_name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Mother's Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="mother_occupation"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Mother's Occupation</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MapPin /> Address Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                        control={form.control}
                        name="present_address"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Present Address</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="permanent_address"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Permanent Address</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText /> Private Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                             <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={() => remove(index)}
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
                        onClick={() => append({ id: `new-doc-${Date.now()}`, label: '', url: '', icon_name: 'File' })}
                    >
                        <Plus className="mr-2" /> Add Document
                    </Button>
                </CardContent>
            </Card>
        </div>
        
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
