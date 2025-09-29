'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ContactDetails, Social, CustomLink } from '@/lib/types';
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
import { Save, Plus, Trash2, Mail, Users, Link as LinkIcon, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateContactAndSocials } from './actions';
import { useTransition } from 'react';
import { Separator } from '@/components/ui/separator';

const socialSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Social media platform name is required.'),
  url: z.string().url('Must be a valid URL.'),
  icon_name: z.string().min(1, 'Icon name is required.'),
});

const customLinkSchema = z.object({
    id: z.string(),
    label: z.string().min(1, 'Label is required.'),
    url: z.string().url('Must be a valid URL.'),
    icon_name: z.string().min(1, 'Icon name is required.'),
});

const phoneNumberSchema = z.object({
    id: z.string(),
    number: z.string().min(1, 'Phone number is required.'),
});

const contactDetailsSchema = z.object({
  phoneNumbers: z.array(phoneNumberSchema),
  emails: z.array(z.object({ value: z.string().email('Must be a valid email.') })),
});

const formSchema = z.object({
  contactDetails: contactDetailsSchema,
  socials: z.array(socialSchema),
  customLinks: z.array(customLinkSchema),
});

type ContactFormValues = z.infer<typeof formSchema>;

export function ContactForm({
  contactDetails,
  socials,
  customLinks,
}: {
  contactDetails: ContactDetails;
  socials: Social[];
  customLinks: CustomLink[];
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactDetails: {
        emails: contactDetails.emails.map(email => ({ value: email })),
        phoneNumbers: contactDetails.phoneNumbers || [],
      },
      socials,
      customLinks,
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
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control: form.control,
    name: 'contactDetails.phoneNumbers',
  });

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({
    control: form.control,
    name: 'socials',
  });

    const {
    fields: customLinkFields,
    append: appendCustomLink,
    remove: removeCustomLink,
  } = useFieldArray({
    control: form.control,
    name: 'customLinks',
  });

  function onSubmit(values: ContactFormValues) {
    const dataToSave = {
        contactDetails: {
            ...values.contactDetails,
            emails: values.contactDetails.emails.map(e => e.value)
        },
        socials: values.socials,
        customLinks: values.customLinks,
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
               <div>
                <FormLabel>Phone Numbers</FormLabel>
                <div className="space-y-3 mt-2">
                  {phoneFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`contactDetails.phoneNumbers.${index}.number`}
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormControl>
                              <Input {...field} placeholder="+1234567890" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePhone(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendPhone({ id: `new-phone-${Date.now()}`, number: '' })}
                  >
                    <Plus className="mr-2" /> Add Phone
                  </Button>
                </div>
              </div>

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

            <div className="space-y-8">
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
                                name={`socials.${index}.icon_name`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon Name (from Lucide)</FormLabel>
                                    <FormControl>
                                    <Input {...field} placeholder="e.g., Linkedin" />
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
                            appendSocial({ id: `new-${Date.now()}`, name: '', url: '', icon_name: '' })
                            }
                        >
                            <Plus className="mr-2" /> Add Social Link
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LinkIcon /> Custom Links
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         {customLinkFields.map((field, index) => (
                            <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                            <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={() => removeCustomLink(index)}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                                <FormField
                                    control={form.control}
                                    name={`customLinks.${index}.label`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Label</FormLabel>
                                        <FormControl>
                                        <Input {...field} placeholder="e.g., My Portfolio" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            <FormField
                                control={form.control}
                                name={`customLinks.${index}.url`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL</FormLabel>
                                    <FormControl>
                                    <Input {...field} placeholder="https://example.com" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`customLinks.${index}.icon_name`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon Name (from Lucide)</FormLabel>
                                    <FormControl>
                                    <Input {...field} placeholder="e.g., Globe" />
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
                            onClick={() => appendCustomLink({ id: `new-custom-${Date.now()}`, label: '', url: '', icon_name: '' })}
                        >
                            <Plus className="mr-2" /> Add Custom Link
                        </Button>
                    </CardContent>
                </Card>
            </div>
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
