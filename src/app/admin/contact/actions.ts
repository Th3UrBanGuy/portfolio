'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { ContactDetails, Social } from '@/lib/types';

// Schema for updating socials
const socialSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Social media platform name is required.'),
  url: z.string().url('Must be a valid URL.'),
  icon_class: z.string().min(1, 'Icon class is required.'),
});
const socialsArraySchema = z.array(socialSchema);

// Schema for updating contact details
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

    // Update socials.json
    const socialsFilePath = path.join(process.cwd(), 'src/lib/data/socials.json');
    await fs.writeFile(socialsFilePath, JSON.stringify(validatedData.socials, null, 2), 'utf8');

    // Update contact-details.json
    const contactDetailsFilePath = path.join(process.cwd(), 'src/lib/data/contact-details.json');
    await fs.writeFile(contactDetailsFilePath, JSON.stringify(validatedData.contactDetails, null, 2), 'utf8');

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
