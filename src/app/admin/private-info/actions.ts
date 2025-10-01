'use server';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { z } from 'zod';
import type { PrivateInfo } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const customFieldSchema = z.object({
    id: z.string(),
    label: z.string().min(1, "Label is required."),
    value: z.string().min(1, "Value is required."),
    isSecret: z.boolean(),
});

const documentSchema = z.object({
    id: z.string(),
    label: z.string().min(1, "Document label is required."),
    url: z.string().url("Must be a valid URL."),
    icon_name: z.string().min(1, "Icon name is required."),
});

const privateInfoSectionSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Section title is required."),
    fields: z.array(customFieldSchema),
});

const privateInfoSchema = z.object({
  sections: z.array(privateInfoSectionSchema),
  documents: z.array(documentSchema),
});

export async function updatePrivateInfo(data: PrivateInfo) {
  try {
    const validatedData = privateInfoSchema.parse(data);
    const docRef = doc(db, 'site-data', 'private-info');
    await setDoc(docRef, validatedData);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'An unknown error occurred.' };
  }
}

export async function updateTitle(data: { pageTitle: string; tocTitle: string }): Promise<{ success: boolean; error?: string }> {
    try {
      await setDoc(doc(db, 'page-titles', 'private-info'), data);
  
      revalidatePath('/');
      revalidatePath('/admin/private-info');
  
      return { success: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.errors.map(e => e.message).join(', ') };
      }
      console.error('Error updating title:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }