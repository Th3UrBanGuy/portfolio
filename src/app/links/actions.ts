'use server';

import { z } from 'zod';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { ShortLink } from '@/lib/types';

// --- Authentication Actions ---
const authSchema = z.object({
  secretKey: z.string().min(1, 'Password is required.'),
});

export async function verifyLinkShortenerKey(prevState: any, formData: FormData) {
  const validatedFields = authSchema.safeParse({
    secretKey: formData.get('secretKey'),
  });

  if (!validatedFields.success) {
    return { error: 'Password cannot be empty.' };
  }

  const { secretKey } = validatedFields.data;
  const authDoc = await getDoc(doc(db, 'site-data', 'link-auth'));

  if (!authDoc.exists() || secretKey !== authDoc.data().key) {
    return { error: 'Invalid password.' };
  }

  cookies().set('link-auth', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });

  redirect('/links');
}

export async function logout() {
    cookies().delete('link-auth');
    redirect('/links/auth');
}

// --- CRUD Actions ---

const linkSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters.')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Slug can only contain letters, numbers, hyphens, and underscores.'),
  destination: z.string().url('Must be a valid URL.'),
});

export async function saveLink(data: z.infer<typeof linkSchema>) {
  try {
    const validatedData = linkSchema.parse(data);
    const { id, slug, destination } = validatedData;

    // Check if slug already exists for another link
    const q = query(collection(db, 'short-links'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty && (!id || querySnapshot.docs[0].id !== id)) {
      return { success: false, error: 'This slug is already in use.' };
    }

    if (id) {
      // Update existing link
      const docRef = doc(db, 'short-links', id);
      await updateDoc(docRef, { slug, destination });
    } else {
      // Create new link
      const newDocRef = doc(collection(db, 'short-links'));
      await setDoc(newDocRef, {
        slug,
        destination,
        createdAt: serverTimestamp(),
      });
    }

    revalidatePath('/links');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(', '),
      };
    }
    return { success: false, error: 'An unknown error occurred.' };
  }
}
