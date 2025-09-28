import type { PortfolioData, Project } from './types';
import { PlaceHolderImages } from './placeholder-images';

import personalInfoData from './data/personal-info.json';
import educationData from './data/education.json';
import skillsData from './data/skills.json';
import experienceData from './data/experience.json';
import contactDetailsData from './data/contact-details.json';
import socialsData from './data/socials.json';
import projectsData from './data/projects.json';
import achievementsData from './data/achievements.json';

const projectImageMap = PlaceHolderImages.reduce((acc, img, index) => {
  if (index < projectsData.length) {
    const projectId = projectsData[index].id;
    acc[projectId] = {
        imageUrl: img.imageUrl,
        imageHint: img.imageHint
    };
  }
  return acc;
}, {} as Record<string, {imageUrl: string, imageHint: string}>);


const authorImage = PlaceHolderImages.find(img => img.id === 'author-image');

const typedProjects = projectsData as (Omit<Project, 'imageUrl' | 'imageHint' | 'name' | 'description'> & {title: string, short_description: string})[];

export const defaultPortfolioData: PortfolioData = {
  personalInfo: personalInfoData,
  education: educationData,
  skills: skillsData,
  experience: experienceData,
  contactDetails: contactDetailsData,
  socials: socialsData,
  achievements: achievementsData,
  aboutMe:
    "I'm a hands-on tech explorer who dives into any technical issue, finds innovative solutions, and stays updated with the latest tech trends - a true 'Jugadu Technophile'. Since 2016, I've been solving diverse tech issues using creative methods and AI tools, and I'm always exploring new technologies.",
  authorImageUrl: authorImage?.imageUrl || '',
  authorImageHint: authorImage?.imageHint || '',
  projects: typedProjects.map((p) => ({
    ...p,
    id: p.id,
    name: p.title,
    description: p.short_description,
    imageUrl: projectImageMap[p.id]?.imageUrl || `https://picsum.photos/seed/${p.id}/600/400`,
    imageHint: projectImageMap[p.id]?.imageHint || 'project image',
    full_description: p.full_description,
    technologies: p.technologies,
    preview_link: p.preview_link,
    category: p.category,
  })),
};

export async function getPortfolioData(): Promise<PortfolioData> {
  // Always return local data as Firebase is removed.
  return defaultPortfolioData;
}
