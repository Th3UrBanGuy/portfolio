'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { Skill } from '@/lib/types';

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
    
    const filePath = path.join(process.cwd(), 'src/lib/data/skills.json');
    await fs.writeFile(filePath, JSON.stringify(validatedData, null, 2), 'utf8');

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
