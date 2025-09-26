import type { PortfolioData, Project } from './types';
import { PlaceHolderImages } from './placeholder-images';
import rawData from './portfolio-data.json';
import { app } from './firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';


const projectImageMap = PlaceHolderImages.reduce((acc, img, index) => {
  if (index < rawData.projects.length) {
    const projectId = rawData.projects[index].id;
    acc[projectId] = {
        imageUrl: img.imageUrl,
        imageHint: img.imageHint
    };
  }
  return acc;
}, {} as Record<string, {imageUrl: string, imageHint: string}>);


const authorImage = PlaceHolderImages.find(img => img.id === 'author-image');

const typedData = rawData as Omit<PortfolioData, 'projects' | 'aboutMe' | 'authorImageUrl' | 'authorImageHint'> & {
    projects: Omit<Project, 'imageUrl' | 'imageHint' | 'name' | 'description'>[] & {title: string, short_description: string}[],
};

export const defaultPortfolioData: PortfolioData = {
  ...typedData,
  personalInfo: typedData.personalInfo,
  education: typedData.education,
  skills: typedData.skills,
  experience: typedData.experience,
  contactDetails: typedData.contactDetails,
  socials: typedData.socials,
  aboutMe:
    "I'm a hands-on tech explorer who dives into any technical issue, finds innovative solutions, and stays updated with the latest tech trends - a true 'Jugadu Technophile'. Since 2016, I've been solving diverse tech issues using creative methods and AI tools, and I'm always exploring new technologies.",
  authorImageUrl: authorImage?.imageUrl || '',
  authorImageHint: authorImage?.imageHint || '',
  projects: typedData.projects.map((p, index) => ({
    ...p,
    id: p.id,
    name: p.title,
    description: p.short_description,
    imageUrl: projectImageMap[p.id]?.imageUrl || `https://picsum.photos/seed/${p.id}/600/400`,
    imageHint: projectImageMap[p.id]?.imageHint || 'project image',
    full_description: p.full_description,
    technologies: p.technologies,
    preview_link: p.preview_link,
  })),
};

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const db = getFirestore(app);
    const docRef = doc(db, 'portfolio', 'data');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Fetching data from Firestore');
      const firestoreData = docSnap.data() as PortfolioData;
      
      // We still merge local image placeholders with firestore data
      const authorImage = PlaceHolderImages.find(img => img.id === 'author-image');
      const projectImageMap = PlaceHolderImages.reduce((acc, img) => {
        acc[img.id] = {
            imageUrl: img.imageUrl,
            imageHint: img.imageHint
        };
        return acc;
      }, {} as Record<string, {imageUrl: string, imageHint: string}>);

      return {
        ...firestoreData,
        authorImageUrl: authorImage?.imageUrl || '',
        authorImageHint: authorImage?.imageHint || '',
        projects: firestoreData.projects.map(p => ({
          ...p,
          imageUrl: projectImageMap[p.id]?.imageUrl || `https://picsum.photos/seed/${p.id}/600/400`,
          imageHint: projectImageMap[p.id]?.imageHint || 'project image',
        }))
      };
    } else {
      console.log('No such document in Firestore, using local data.');
      return defaultPortfolioData;
    }
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    // In case of error (e.g., Firestore not set up), fall back to local data.
    return defaultPortfolioData;
  }
}
