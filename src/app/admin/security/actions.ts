'use server';

import { z } from 'zod';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

const securitySchema = z.object({
  secretKey: z.string().min(6, 'Secret key must be at least 6 characters long.'),
});

export async function updateSecretKey(data: { secretKey: string }): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedData = securitySchema.parse(data);

    await setDoc(doc(db, 'site-data', 'admin-auth'), { key: validatedData.secretKey });

    revalidatePath('/admin/security');

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    console.error('Error updating secret key:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
