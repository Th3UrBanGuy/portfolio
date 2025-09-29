'use server';

import { z } from 'zod';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import type { Experience } from '@/lib/types';
import { getCollectionData } from '@/lib/placeholder-data';

const experienceSchema = z.object({
  id: z.string(),
  role: z.string().min(1, "Role is required."),
  company: z.string().min(1, "Company name is required."),
  location: z.string().min(1, "Location is required."),
  duration: z.string().min(1, "Duration is required."),
  short_description: z.string().min(1, "Short description is required."),
  details: z.array(z.string().min(1, "Detail cannot be empty.")).min(1, "At least one detail point is required."),
});

const experienceArraySchema = z.array(experienceSchema);

export async function updateExperience(experienceData: Experience[]): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedData = experienceArraySchema.parse(experienceData);
    
    const batch = writeBatch(db);
    const experienceCollection = collection(db, 'experience');

    const existingDocs = await getCollectionData<Experience>('experience');
    existingDocs.forEach(docToDelete => {
      batch.delete(doc(experienceCollection, docToDelete.id));
    });
    
    validatedData.forEach(exp => {
      const docRef = doc(experienceCollection, exp.id);
      batch.set(docRef, exp);
    });

    await batch.commit();

    revalidatePath('/');
    revalidatePath('/admin/experience');

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    console.error('Error updating experience data:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
