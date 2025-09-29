'use client';

import { useForm } from 'react-hook-form';
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateSecretKey } from './actions';
import { useTransition, useState } from 'react';

const securitySchema = z.object({
  secretKey: z.string().min(6, 'Secret key must be at least 6 characters long.'),
});

type SecurityFormValues = z.infer<typeof securitySchema>;

export function SecurityForm({ currentKey }: { currentKey: string }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showKey, setShowKey] = useState(false);

  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      secretKey: currentKey,
    },
  });

  function onSubmit(values: SecurityFormValues) {
    startTransition(async () => {
      const result = await updateSecretKey(values);
      if (result.success) {
        toast({
          title: 'Secret Key Updated',
          description: 'The admin access key has been changed successfully.',
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
            <CardTitle>Update Secret Key</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="secretKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Secret Key</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showKey ? 'text' : 'password'}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowKey(!showKey)}
                    >
                      {showKey ? <EyeOff /> : <Eye />}
                      <span className="sr-only">{showKey ? 'Hide key' : 'Show key'}</span>
                    </Button>
                  </div>
                  <FormDescription>
                    This key will be required to access the admin panel. Minimum 6 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            <Save className="mr-2" />
            {isPending ? 'Saving...' : 'Save Key'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
