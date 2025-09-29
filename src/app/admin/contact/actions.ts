'use server';

import { z } from 'zod';
import { collection, writeBatch, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import type { Social } from '@/lib/types';
import { getCollectionData } from '@/lib/placeholder-data';


const socialSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Social media platform name is required.'),
  url: z.string().url('Must be a valid URL.'),
  icon_class: z.string().min(1, 'Icon class is required.'),
});
const socialsArraySchema = z.array(socialSchema);


const contactDetailsSchema = z.object({
  contactMeLink: z.string().url('Must be a valid URL.'),
  phone: z.string().min(1, 'Phone number is required.'),
  emails: z.array(z.string().email('Must be a valid email.')),
});

const combinedSchema = z.object({
    contactDetails: contactDetailsSchema,
    socials: socialsArraySchema
})

export async function updateContactAndSocials(
  data: z.infer<typeof combinedSchema>
): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedData = combinedSchema.parse(data);

    // Update socials collection
    const batch = writeBatch(db);
    const socialsCollection = collection(db, 'socials');
    const existingSocials = await getCollectionData<Social>('socials');
    existingSocials.forEach(docToDelete => {
      batch.delete(doc(socialsCollection, docToDelete.id));
    });
    validatedData.socials.forEach(social => {
      const docRef = doc(socialsCollection, social.id);
      batch.set(docRef, social);
    });
    await batch.commit();

    // Update contact-details document
    await setDoc(doc(db, 'site-data', 'contact-details'), validatedData.contactDetails, { merge: true });

    revalidatePath('/');
    revalidatePath('/admin/contact');

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map((e) => `${e.path.join('.')} - ${e.message}`).join(', ') };
    }
    console.error('Error updating contact/socials data:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
