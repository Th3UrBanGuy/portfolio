'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { verifySecretKey } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Verifying...' : 'Authenticate'}
    </Button>
  );
}

function AuthForm() {
    const [state, formAction] = useActionState(verifySecretKey, null);
    
    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <Input
                id="secretKey"
                name="secretKey"
                type="password"
                placeholder="Your Secret Key"
                required
                />
            </div>
            {state?.error && (
                <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Authentication Failed</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}
            <SubmitButton />
        </form>
    );
}


export default function AuthPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>
            Enter the secret key to access the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm />
        </CardContent>
      </Card>
    </div>
  );
}
