'use server';

import { z } from 'zod';
import { getDocumentData } from '@/lib/placeholder-data';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const schema = z.object({
  secretKey: z.string().min(1, 'Secret key is required.'),
});

export async function verifySecretKey(prevState: any, formData: FormData) {
  const validatedFields = schema.safeParse({
    secretKey: formData.get('secretKey'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Secret key cannot be empty.',
    };
  }

  const { secretKey } = validatedFields.data;

  const authData = await getDocumentData<{ key: string }>('site-data', 'admin-auth');

  if (!authData || secretKey !== authData.key) {
    return {
      error: 'Invalid secret key.',
    };
  }

  cookies().set('admin-auth', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  redirect('/admin');
}
