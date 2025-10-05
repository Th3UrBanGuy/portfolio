'use server';

import { z } from 'zod';
import { collection, writeBatch, doc, setDoc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import { getCollectionData } from '@/lib/placeholder-data';
import type { Project } from '@/lib/types';

const projectLinkSchema = z.object({
  label: z.string().min(1, "Link label is required."),
  url: z.string().url("Must be a valid URL."),
});

const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required."),
  short_description: z.string().min(1, "Short description is required."),
  image_url: z.string().min(1, "Image URL is required."),
  full_description: z.string().min(1, "Full description is required."),
  technologies: z.array(z.string().min(1, "Technology cannot be empty.")).min(1, "At least one technology is required."),
  links: z.array(projectLinkSchema).min(1, "At least one link is required."),
  category: z.string(),
});

const projectsArraySchema = z.array(projectSchema);

type ProjectData = z.infer<typeof projectsArraySchema>;

export async function updateProjects(projectsData: ProjectData): Promise<{ success: boolean; error?: string }> {
  try {
    // Convert '__individual__' back to an empty string before validation/saving
    const sanitizedData = projectsData.map(p => ({
        ...p,
        category: p.category === '__individual__' ? '' : p.category,
    }));
      
    const validatedData = projectsArraySchema.parse(sanitizedData);
    
    const batch = writeBatch(db);
    const projectsCollection = collection(db, 'projects');

    const existingDocs = await getCollectionData<Project>('projects');
    existingDocs.forEach(docToDelete => {
      batch.delete(doc(projectsCollection, docToDelete.id));
    });
    
    validatedData.forEach(proj => {
      const docRef = doc(projectsCollection, proj.id);
      batch.set(docRef, proj);
    });

    await batch.commit();

    revalidatePath('/');
    revalidatePath('/admin/projects');

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => `${e.path.join('.')} - ${e.message}`).join(', ') };
    }
    console.error('Error updating projects data:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function updateTitle(data: { pageTitle: string; tocTitle: string }): Promise<{ success: boolean; error?: string }> {
    try {
      await setDoc(doc(db, 'page-titles', 'projects'), data);
  
      revalidatePath('/');
      revalidatePath('/admin/projects');
  
      return { success: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.errors.map(e => e.message).join(', ') };
      }
      console.error('Error updating title:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }

const bundleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Bundle name is required."),
});

export async function addBundle(name: string): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const validatedData = bundleSchema.omit({id: true}).parse({ name });
    const docRef = await addDoc(collection(db, "project-bundles"), validatedData);
    revalidatePath('/admin/projects');
    return { success: true, id: docRef.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function updateBundle(id: string, name: string): Promise<{ success: boolean; error?: string }> {
    try {
        const validatedData = bundleSchema.omit({id: true}).parse({ name });
        const docRef = doc(db, 'project-bundles', id);
        await updateDoc(docRef, validatedData);
        revalidatePath('/admin/projects');
        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors.map(e => e.message).join(', ') };
        }
        return { success: false, error: 'An unexpected error occurred.' };
    }
}

export async function deleteBundle(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(db, 'project-bundles', id);
        await deleteDoc(docRef);
        revalidatePath('/admin/projects');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
