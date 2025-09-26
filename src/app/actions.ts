'use server';

import { generatePortfolioContentFromURL } from '@/ai/flows/generate-portfolio-content-from-url';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { PortfolioData, Project } from '@/lib/types';

function parseProjects(projectsText: string): Project[] {
  if (!projectsText || projectsText.trim() === '') {
    return [];
  }

  const projectEntries = projectsText.split(/(\r\n|\n){2,}/).filter(p => p.trim() !== '');

  return projectEntries.map((entry, index) => {
    const lines = entry.split(/\r\n|\n/);
    const nameMatch = lines[0].match(/^(.*?):/);
    const name = nameMatch ? nameMatch[1].replace(/project name/i, '').trim() : `Project ${index + 1}`;
    
    const description = lines.join(' ').replace(nameMatch ? nameMatch[0] : '', '').trim();
    
    const techRegex = /technologies used: (.*)/i;
    const techMatch = description.match(techRegex);
    const technologies = techMatch ? techMatch[1].split(',').map(t => t.trim()) : [];
    const cleanDescription = description.replace(techRegex, '').trim();
    
    const image = PlaceHolderImages[index % PlaceHolderImages.length];

    return {
      id: (index + 1).toString(),
      name,
      description: cleanDescription,
      technologies,
      imageUrl: image?.imageUrl || `https://picsum.photos/seed/proj${index}/600/400`,
      imageHint: image?.imageHint || 'tech abstract',
    };
  });
}

export async function generatePortfolioAction(url: string): Promise<PortfolioData> {
  try {
    const { aboutMe, projects } = await generatePortfolioContentFromURL({ url });

    const parsedProjects = parseProjects(projects);

    return {
      aboutMe: aboutMe || 'No "About Me" content could be generated. Please edit this section.',
      projects: parsedProjects.length > 0 ? parsedProjects : [
          {
            id: '1',
            name: 'Sample Project',
            description: 'The AI could not find any projects. Please add your projects manually.',
            technologies: ['React', 'Next.js'],
            imageUrl: PlaceHolderImages[0].imageUrl,
            imageHint: PlaceHolderImages[0].imageHint
          }
      ],
    };
  } catch (error) {
    console.error('Error in generatePortfolioAction:', error);
    throw new Error('Failed to generate portfolio content from the provided URL.');
  }
}
