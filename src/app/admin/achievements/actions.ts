'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { Achievement } from '@/lib/types';

const achievementSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required."),
  short_description: z.string().min(1, "Short description is required."),
  icon_url: z.string().min(1, "Icon URL is required."),
  certificate_image_url: z.string().url("Must be a valid URL."),
  full_description: z.string().min(1, "Full description is required."),
  how_achieved: z.string().min(1, "This field is required."),
  words_about_it: z.string().min(1, "This field is required."),
});

const achievementsArraySchema = z.array(achievementSchema);

export async function updateAchievements(achievementsData: Achievement[]): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedData = achievementsArraySchema.parse(achievementsData);
    
    const filePath = path.join(process.cwd(), 'src/lib/data/achievements.json');
    await fs.writeFile(filePath, JSON.stringify(validatedData, null, 2), 'utf8');

    revalidatePath('/');
    revalidatePath('/admin/achievements');

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    console.error('Error updating achievements data:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
