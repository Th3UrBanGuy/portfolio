import { z } from 'zod';

export const PageSchema = z.enum([
  'cover', 'toc', 'about', 'private-info', 'education', 'skills',
  'experience', 'achievements', 'projects', 'contact', 'back-cover'
]);

export type Page = z.infer<typeof PageSchema>;

export const ALL_PAGES: Page[] = [
  'cover', 'toc', 'about', 'private-info', 'education', 'skills', 
  'experience', 'achievements', 'projects', 'contact', 'back-cover'
];