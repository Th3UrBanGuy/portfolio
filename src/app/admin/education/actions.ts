'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { Education } from '@/lib/types';

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
    
    const filePath = path.join(process.cwd(), 'src/lib/data/education.json');
    await fs.writeFile(filePath, JSON.stringify(validatedData, null, 2), 'utf8');

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
