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
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

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
  path: z.string().min(1, 'Path is required. Use "/" for root.').regex(/^[a-zA-Z0-9_-]*$|\/$/, 'Path can only contain letters, numbers, hyphens, and underscores, or be a single "/"'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters.')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Slug can only contain letters, numbers, hyphens, and underscores.'),
  destination: z.string().url('Must be a valid URL.'),
  password: z.string().optional(),
  loading_text: z.string().optional(),
  loading_duration_seconds: z.coerce.number().optional(),
});

export async function saveLink(data: z.infer<typeof linkSchema>) {
  try {
    const validatedData = linkSchema.parse(data);
    const { id, path, slug, destination, password, loading_text, loading_duration_seconds } = validatedData;
    
    // Check for uniqueness
    const q = query(
        collection(db, 'short-links'), 
        where('path', '==', path), 
        where('slug', '==', slug)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty && (!id || querySnapshot.docs[0].id !== id)) {
      return { success: false, error: 'This path/slug combination is already in use.' };
    }

    const linkData: any = {
      path,
      slug,
      destination,
      password: password || null,
      loading_text: loading_text || null,
      loading_duration_seconds: loading_duration_seconds || null,
    };
    
    if (id) {
      const docRef = doc(db, 'short-links', id);
      await updateDoc(docRef, linkData);
    } else {
      linkData.createdAt = serverTimestamp();
      const newDocRef = doc(collection(db, 'short-links'));
      await setDoc(newDocRef, linkData);
    }

    revalidatePath('/links');
    revalidatePath(`/${path}/${slug}`);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => `${e.path.join('.')} - ${e.message}`).join(', '),
      };
    }
    return { success: false, error: 'An unknown error occurred.' };
  }
}

export async function deleteLink(id: string) {
  try {
    if (!id) {
      return { success: false, error: 'No ID provided for deletion.' };
    }
    const docRef = doc(db, 'short-links', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const { path, slug } = docSnap.data();
        await deleteDoc(docRef);
        revalidatePath('/links');
        if (path && slug) {
            revalidatePath(`/${path}/${slug}`);
        }
    } else {
        return { success: false, error: 'Link not found.' };
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to delete link:", error);
    return { success: false, error: 'Failed to delete link.' };
  }
}
