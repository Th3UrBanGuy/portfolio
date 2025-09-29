'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { PortfolioData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from './actions';
import { useTransition } from 'react';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  authorImageUrl: z.string().url('Please enter a valid URL.'),
  authorImageHint: z.string(),
  dob: z.string(),
  bloodGroup: z.string(),
  nationality: z.string(),
  occupation: z.string(),
  hobby: z.string(),
  aimInLife: z.string(),
  aboutMe: z.string().min(10, 'About me section is too short.'),
  cvLink: z.string().url('Please enter a valid URL for your CV.'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ data }: { data: PortfolioData }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: data.personalInfo.name,
      authorImageUrl: data.authorImageUrl,
      authorImageHint: data.authorImageHint,
      dob: data.personalInfo.dob,
      bloodGroup: data.personalInfo.bloodGroup,
      nationality: data.personalInfo.nationality,
      occupation: data.personalInfo.occupation,
      hobby: data.personalInfo.hobby,
      aimInLife: data.personalInfo.aimInLife,
      aboutMe: data.aboutMe,
      cvLink: data.contactDetails.contactMeLink,
    },
  });

  function onSubmit(values: ProfileFormValues) {
     startTransition(async () => {
      const result = await updateProfile(values);
      if (result.success) {
        toast({
          title: 'Profile Updated',
          description: 'Your profile details have been saved.',
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
        <Card>
          <CardHeader>
            <CardTitle>Author Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="authorImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/your-image.png" {...field} />
                  </FormControl>
                  <FormDescription>The main image used on the "About Me" page.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="authorImageHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image AI Hint</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. author portrait" {...field} />
                  </FormControl>
                  <FormDescription>A hint for AI to understand the image content.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="cvLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CV Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/your-cv.pdf" {...field} />
                  </FormControl>
                  <FormDescription>Link to your full curriculum vitae.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>About Me Section</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="aboutMe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biography</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell a little bit about yourself"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will appear in the "About Me" card on your portfolio.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="bloodGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Group</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="hobby"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hobby</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="aimInLife"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ambition</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
