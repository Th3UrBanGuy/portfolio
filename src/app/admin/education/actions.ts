'use server';

import { z } from 'zod';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import type { Education } from '@/lib/types';
import { getCollectionData } from '@/lib/placeholder-data';

const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution name is required."),
  session: z.string().min(1, "Session is required."),
  details: z.string().min(1, "Details are required."),
});

const educationArraySchema = z.array(educationSchema);

export async function updateEducation(educationData: Education[]): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedData = educationArraySchema.parse(educationData);
    
    const batch = writeBatch(db);
    const educationCollection = collection(db, 'education');

    // Simple strategy: delete all existing docs and add the new ones.
    // For large collections, a more sophisticated diff-and-update would be better.
    const existingDocs = await getCollectionData<Education>('education');
    existingDocs.forEach(docToDelete => {
      batch.delete(doc(educationCollection, docToDelete.id));
    });
    
    validatedData.forEach(edu => {
      const docRef = doc(educationCollection, edu.id);
      batch.set(docRef, edu);
    });

    await batch.commit();

    revalidatePath('/');
    revalidatePath('/admin/education');

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    console.error('Error updating education data:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
