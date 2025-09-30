'use server';

import { z } from 'zod';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

const documentSchema = z.object({
    id: z.string(),
    label: z.string().min(1, "Document label is required."),
    url: z.string().url("Must be a valid URL."),
    icon_name: z.string().min(1, "Icon name is required."),
});

const privateInfoSchema = z.object({
  father_name: z.string().min(1, "Father's name is required."),
  father_occupation: z.string().min(1, "Father's occupation is required."),
  mother_name: z.string().min(1, "Mother's name is required."),
  mother_occupation: z.string().min(1, "Mother's occupation is required."),
  present_address: z.string().min(1, "Present address is required."),
  permanent_address: z.string().min(1, "Permanent address is required."),
  documents: z.array(documentSchema),
});

type PrivateInfoFormValues = z.infer<typeof privateInfoSchema>;

export async function updatePrivateInfo(data: PrivateInfoFormValues): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedData = privateInfoSchema.parse(data);

    await setDoc(doc(db, 'site-data', 'private-info'), validatedData, { merge: true });

    revalidatePath('/');
    revalidatePath('/admin');

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => `${e.path.join('.')} - ${e.message}`).join(', ') };
    }
    console.error('Error updating private info data:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
