'use server';

import { z } from 'zod';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

const adminKeySchema = z.object({
  secretKey: z.string().min(6, 'Secret key must be at least 6 characters long.'),
});

const linkShortenerKeySchema = z.object({
    linkShortenerKey: z.string().min(6, 'Password must be at least 6 characters long.'),
});

export async function updateAdminKey(data: { secretKey: string }): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedData = adminKeySchema.parse(data);
    await setDoc(doc(db, 'site-data', 'admin-auth'), { key: validatedData.secretKey });
    revalidatePath('/admin/security');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    console.error('Error updating admin key:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function updateLinkShortenerKey(data: { linkShortenerKey: string }): Promise<{ success: boolean; error?: string }> {
    try {
      const validatedData = linkShortenerKeySchema.parse(data);
      await setDoc(doc(db, 'site-data', 'link-auth'), { key: validatedData.linkShortenerKey });
      revalidatePath('/admin/security');
      return { success: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.errors.map(e => e.message).join(', ') };
      }
      console.error('Error updating link shortener key:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
}

export async function resetSecretKey(key: string): Promise<void> {
  if (!key || typeof key !== 'string' || key.length < 1) {
    console.error('Attempted to reset key with an invalid value.');
    return;
  }
  try {
    await setDoc(doc(db, 'site-data', 'admin-auth'), { key });
    console.log(`Secret key has been reset to: ${key}`);
    revalidatePath('/admin/security');
  } catch (error) {
    console.error('Error resetting secret key:', error);
  }
}
