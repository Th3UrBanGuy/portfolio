'use server';

import { z } from 'zod';
import { collection, writeBatch, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import type { Achievement } from '@/lib/types';
import { getCollectionData } from '@/lib/placeholder-data';

const achievementSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required."),
  short_description: z.string().min(1, "Short description is required."),
  icon_url: z.string().min(1, "Icon URL is required."),
  certificate_image_url: z.string().url("Must be a valid URL."),
  full_description: z.string().min(1, "Full description is required."),
  how_achieved: z.string().min(1, "This field is required."),
  words_about_it: z.string().min(1, "This field is required."),
  order: z.number(),
});

const achievementsArraySchema = z.array(achievementSchema);

export async function updateAchievements(achievementsData: Omit<Achievement, 'order'>[]): Promise<{ success: boolean; error?: string }> {
  try {
    const dataWithOrder = achievementsData.map((ach, index) => ({ ...ach, order: index }));
    const validatedData = achievementsArraySchema.parse(dataWithOrder);
    
    const batch = writeBatch(db);
    const achievementsCollection = collection(db, 'achievements');

    const existingDocs = await getCollectionData<Achievement>('achievements');
    existingDocs.forEach(docToDelete => {
      batch.delete(doc(achievementsCollection, docToDelete.id));
    });
    
    validatedData.forEach(ach => {
      const docRef = doc(achievementsCollection, ach.id);
      batch.set(docRef, ach);
    });

    await batch.commit();

    revalidatePath('/');
    revalidatePath('/admin/achievements');

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    console.error('Error updating achievements data:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function updateTitle(data: { pageTitle: string; tocTitle: string }): Promise<{ success: boolean; error?: string }> {
    try {
      await setDoc(doc(db, 'page-titles', 'achievements'), data);
  
      revalidatePath('/');
      revalidatePath('/admin/achievements');
  
      return { success: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.errors.map(e => e.message).join(', ') };
      }
      console.error('Error updating title:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }