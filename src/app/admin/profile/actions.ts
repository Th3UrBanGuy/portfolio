'use server';

import { z } from 'zod';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  authorImageUrl: z.string().url('Please enter a valid URL.'),
  authorImageHint: z.string(),
  dob: z.string(),
  bloodGroup: z.string(),
  nationality: z.string(),
  occupation: z.string(),
  hobby: z.string(),
  aimInLife: z.string(),
  aboutMe: z.string().min(10, 'About me section is too short.'),
  cvLink: z.string().url('Please enter a valid URL for your CV.'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export async function updateProfile(data: ProfileFormValues): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedData = profileFormSchema.parse(data);

    const { name, dob, bloodGroup, nationality, occupation, hobby, aimInLife, aboutMe, authorImageUrl, authorImageHint, cvLink } = validatedData;
    
    const personalInfo = { name, dob, bloodGroup, nationality, occupation, hobby, aimInLife };

    await setDoc(doc(db, 'site-data', 'personal-info'), personalInfo, { merge: true });
    await setDoc(doc(db, 'site-data', 'about-me'), { content: aboutMe }, { merge: true });
    await setDoc(doc(db, 'site-data', 'author-image'), { url: authorImageUrl, hint: authorImageHint }, { merge: true });
    await setDoc(doc(db, 'site-data', 'cv-link'), { url: cvLink }, { merge: true });

    revalidatePath('/');
    revalidatePath('/admin/profile');

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => `${e.path.join('.')} - ${e.message}`).join(', ') };
    }
    console.error('Error updating profile data:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function updateTitle(data: { pageTitle: string; tocTitle: string }): Promise<{ success: boolean; error?: string }> {
    try {
      await setDoc(doc(db, 'page-titles', 'profile'), data);
  
      revalidatePath('/');
      revalidatePath('/admin/profile');
  
      return { success: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.errors.map(e => e.message).join(', ') };
      }
      console.error('Error updating title:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }
