'use server';

import { z } from 'zod';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const schema = z.object({
  id: z.string().min(1, 'Link ID is missing.'),
  destination_b64: z.string().min(1, 'Destination is missing.'),
  password: z.string().min(1, 'Password is required.'),
});

type State = {
  success: boolean;
  destination?: string;
  error?: string;
};

export async function verifyPassword(prevState: any, formData: FormData): Promise<State | null> {
  const validatedFields = schema.safeParse({
    id: formData.get('id'),
    destination_b64: formData.get('destination_b64'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }

  const { id, destination_b64, password } = validatedFields.data;

  try {
    const linkDoc = await getDoc(doc(db, 'short-links', id));

    if (!linkDoc.exists() || !linkDoc.data().password) {
      return { success: false, error: 'This link is not password protected.' };
    }

    if (linkDoc.data().password !== password) {
      return { success: false, error: 'Invalid password. Access denied.' };
    }

    const destination = Buffer.from(destination_b64, 'base64').toString('ascii');
    
    // On success, return the destination URL to the client
    return { success: true, destination };

  } catch (e) {
    return { success: false, error: 'Could not verify link. Please try again.' };
  }
}
