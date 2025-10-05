'use server';

import { z } from 'zod';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { redirect } from 'next/navigation';

const schema = z.object({
  id: z.string().min(1, 'Link ID is missing.'),
  destination_b64: z.string().min(1, 'Destination is missing.'),
  password: z.string().min(1, 'Password is required.'),
});

export async function verifyPassword(prevState: any, formData: FormData) {
  const validatedFields = schema.safeParse({
    id: formData.get('id'),
    destination_b64: formData.get('destination_b64'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      error: 'An unexpected error occurred. Please try again.',
    };
  }

  const { id, destination_b64, password } = validatedFields.data;

  try {
    const linkDoc = await getDoc(doc(db, 'short-links', id));

    if (!linkDoc.exists() || !linkDoc.data().password) {
      return { error: 'This link is not password protected.' };
    }

    if (linkDoc.data().password !== password) {
      return { error: 'Invalid password. Access denied.' };
    }

  } catch (e) {
    return { error: 'Could not verify link. Please try again.' };
  }
  
  const destination = Buffer.from(destination_b64, 'base64').toString('ascii');
  redirect(destination);
}
