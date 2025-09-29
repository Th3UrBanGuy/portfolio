'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ContactDetails, Social } from '@/lib/types';
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
import { Save, Plus, Trash2, Mail, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateContactAndSocials } from './actions';
import { useTransition } from 'react';
import { Separator } from '@/components/ui/separator';

const socialSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Social media platform name is required.'),
  url: z.string().url('Must be a valid URL.'),
  icon_class: z.string().min(1, 'Icon class is required.'),
});

const contactDetailsSchema = z.object({
  contactMeLink: z.string().url('Must be a valid URL.'),
  phone: z.string().min(1, 'Phone number is required.'),
  emails: z.array(z.object({ value: z.string().email('Must be a valid email.') })),
});

const formSchema = z.object({
  contactDetails: contactDetailsSchema,
  socials: z.array(socialSchema),
});

type ContactFormValues = z.infer<typeof formSchema>;

export function ContactForm({
  contactDetails,
  socials,
}: {
  contactDetails: ContactDetails;
  socials: Social[];
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactDetails: {
        ...contactDetails,
        emails: contactDetails.emails.map(email => ({ value: email })),
      },
      socials,
    },
  });

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({
    control: form.control,
    name: 'contactDetails.emails',
  });

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({
    control: form.control,
    name: 'socials',
  });

  function onSubmit(values: ContactFormValues) {
    const dataToSave = {
        contactDetails: {
            ...values.contactDetails,
            emails: values.contactDetails.emails.map(e => e.value)
        },
        socials: values.socials
    };

    startTransition(async () => {
      const result = await updateContactAndSocials(dataToSave);
      if (result.success) {
        toast({
          title: 'Contact Info Updated',
          description: 'Your contact and social links have been saved.',
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail /> Direct Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="contactDetails.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactDetails.contactMeLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio Link</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., https://bio.link/yourname" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <div>
                <FormLabel>Email Addresses</FormLabel>
                <div className="space-y-3 mt-2">
                  {emailFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`contactDetails.emails.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormControl>
                              <Input {...field} placeholder="example@email.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEmail(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendEmail({ value: '' })}
                  >
                    <Plus className="mr-2" /> Add Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users /> Social Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {socialFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                   <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => removeSocial(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <div className="grid grid-cols-2 gap-4">
                         <FormField
                            control={form.control}
                            name={`socials.${index}.name`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Platform</FormLabel>
                                <FormControl>
                                <Input {...field} placeholder="e.g., LinkedIn" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`socials.${index}.id`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID (Unique)</FormLabel>
                                <FormControl>
                                <Input {...field} placeholder="e.g., linkedin" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                  <FormField
                    control={form.control}
                    name={`socials.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://linkedin.com/in/..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`socials.${index}.icon_class`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Linkedin (from lucide-react)" />
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
                onClick={() =>
                  appendSocial({ id: `new-${Date.now()}`, name: '', url: '', icon_class: '' })
                }
              >
                <Plus className="mr-2" /> Add Social Link
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
