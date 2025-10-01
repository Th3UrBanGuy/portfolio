'use server';

import { z } from 'zod';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import { PageSchema } from '@/lib/schemas/page';

const sequenceSchema = z.object({
  activePages: z.array(PageSchema),
  hiddenPages: z.array(PageSchema),
});

export async function updateSequence(data: z.infer<typeof sequenceSchema>): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedData = sequenceSchema.parse(data);

    await setDoc(doc(db, 'site-data', 'page-sequence'), validatedData);

    revalidatePath('/');
    revalidatePath('/admin');

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => `${e.path.join('.')} - ${e.message}`).join(', ') };
    }
    console.error('Error updating page sequence:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
