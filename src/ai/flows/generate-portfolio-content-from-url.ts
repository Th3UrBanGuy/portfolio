'use server';
/**
 * @fileOverview An AI agent that extracts content from a URL and populates
 * the 'About Me' and 'Projects' sections of a portfolio.
 *
 * - generatePortfolioContentFromURL - A function that handles the content extraction process.
 * - GeneratePortfolioContentFromURLInput - The input type for the generatePortfolioContentFromURL function.
 * - GeneratePortfolioContentFromURLOutput - The return type for the generatePortfolioContentFromURL function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePortfolioContentFromURLInputSchema = z.object({
  url: z.string().url().describe('The URL to extract content from (e.g., LinkedIn profile, personal website).'),
});
export type GeneratePortfolioContentFromURLInput = z.infer<typeof GeneratePortfolioContentFromURLInputSchema>;

const GeneratePortfolioContentFromURLOutputSchema = z.object({
  aboutMe: z.string().describe('The extracted content for the About Me section.'),
  projects: z.string().describe('The extracted content for the Projects section.'),
});
export type GeneratePortfolioContentFromURLOutput = z.infer<typeof GeneratePortfolioContentFromURLOutputSchema>;

export async function generatePortfolioContentFromURL(input: GeneratePortfolioContentFromURLInput): Promise<GeneratePortfolioContentFromURLOutput> {
  return generatePortfolioContentFromURLFlow(input);
}

const extractPortfolioContentPrompt = ai.definePrompt({
  name: 'extractPortfolioContentPrompt',
  input: {schema: GeneratePortfolioContentFromURLInputSchema},
  output: {schema: GeneratePortfolioContentFromURLOutputSchema},
  prompt: `You are an AI assistant specialized in extracting content for online portfolios.

  Given a URL, your task is to extract relevant information to populate the 'About Me' and 'Projects' sections of a portfolio.
  Focus on extracting clear, concise, and professional content.

  URL: {{{url}}}

  Output the extracted 'About Me' and 'Projects' content in the following JSON format:
  {
    "aboutMe": "Extracted content for the About Me section",
    "projects": "Extracted content for the Projects section"
  }`,
});

const generatePortfolioContentFromURLFlow = ai.defineFlow(
  {
    name: 'generatePortfolioContentFromURLFlow',
    inputSchema: GeneratePortfolioContentFromURLInputSchema,
    outputSchema: GeneratePortfolioContentFromURLOutputSchema,
  },
  async input => {
    const {output} = await extractPortfolioContentPrompt(input);
    return output!;
  }
);
