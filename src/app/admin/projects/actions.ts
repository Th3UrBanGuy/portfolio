'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required."),
  short_description: z.string().min(1, "Short description is required."),
  image_url: z.string().min(1, "Image URL is required."),
  full_description: z.string().min(1, "Full description is required."),
  technologies: z.array(z.string().min(1, "Technology cannot be empty.")).min(1, "At least one technology is required."),
  preview_link: z.string().url("Must be a valid URL."),
  documentation_link: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
  category: z.string().min(1, "Category is required."),
});

const projectsArraySchema = z.array(projectSchema);

type ProjectData = z.infer<typeof projectsArraySchema>;

export async function updateProjects(projectsData: ProjectData): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedData = projectsArraySchema.parse(projectsData);
    
    const filePath = path.join(process.cwd(), 'src/lib/data/projects.json');
    await fs.writeFile(filePath, JSON.stringify(validatedData, null, 2), 'utf8');

    revalidatePath('/');
    revalidatePath('/admin/projects');

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    console.error('Error updating projects data:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
