'use server';

import { z } from 'zod';
import { collection, writeBatch, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import type { Skill } from '@/lib/types';
import { getCollectionData } from '@/lib/placeholder-data';

const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Skill name is required."),
  icon: z.string().min(1, "Icon is required."),
  description: z.string().min(1, "Description is required."),
  category: z.string().min(1, "Category is required."),
});

const skillsArraySchema = z.array(skillSchema);

export async function updateSkills(skillsData: Skill[]): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedData = skillsArraySchema.parse(skillsData);
    
    const batch = writeBatch(db);
    const skillsCollection = collection(db, 'skills');

    const existingDocs = await getCollectionData<Skill>('skills');
    existingDocs.forEach(docToDelete => {
      batch.delete(doc(skillsCollection, docToDelete.id));
    });
    
    validatedData.forEach(skill => {
      const docRef = doc(skillsCollection, skill.id);
      batch.set(docRef, skill);
    });

    await batch.commit();

    revalidatePath('/');
    revalidatePath('/admin/skills');

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    console.error('Error updating skills data:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function updateTitle(data: { pageTitle: string; tocTitle: string }): Promise<{ success: boolean; error?: string }> {
    try {
      await setDoc(doc(db, 'page-titles', 'skills'), data);
  
      revalidatePath('/');
      revalidatePath('/admin/skills');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    console.error('Error updating title:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}