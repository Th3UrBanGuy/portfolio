import type { PortfolioData, Project, ProjectLink, PersonalInfo, Education, Skill, Experience, ContactDetails, Social, Achievement } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const authorImage = PlaceHolderImages.find(img => img.id === 'author-image');

async function getCollectionData<T>(collectionName: string): Promise<T[]> {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

async function getDocumentData<T>(collectionName: string, docId: string): Promise<T | null> {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as T;
    }
    return null;
}

export async function getPortfolioData(): Promise<PortfolioData> {
    const [
        personalInfo,
        education,
        skills,
        experience,
        contactDetails,
        socials,
        achievements,
        projects
    ] = await Promise.all([
        getDocumentData<PersonalInfo>('site-data', 'personal-info'),
        getCollectionData<Education>('education'),
        getCollectionData<Skill>('skills'),
        getCollectionData<Experience>('experience'),
        getDocumentData<ContactDetails>('site-data', 'contact-details'),
        getCollectionData<Social>('socials'),
        getCollectionData<Achievement>('achievements'),
        getCollectionData<Project>('projects'),
    ]);

    const aboutMeDoc = await getDocumentData<{ content: string }>('site-data', 'about-me');
    const cvLinkDoc = await getDocumentData<{ url: string }>('site-data', 'cv-link');

    const projectImageMap = PlaceHolderImages.reduce((acc, img, index) => {
        if (img.id.startsWith('project-')) {
            const projectId = projects.find(p => p.image_url.includes(img.id))?.id || projects[index]?.id;
            if (projectId) {
                acc[projectId] = {
                    imageUrl: img.imageUrl,
                    imageHint: img.imageHint
                };
            }
        }
        return acc;
    }, {} as Record<string, {imageUrl: string, imageHint: string}>);


    const typedProjects = projects as (Omit<Project, 'imageUrl' | 'imageHint' | 'name' | 'description'> & {title: string, short_description: string})[];

    return {
        personalInfo: personalInfo!,
        education: education,
        skills: skills,
        experience: experience,
        contactDetails: contactDetails!,
        socials: socials,
        achievements: achievements,
        aboutMe: aboutMeDoc?.content || "Default about me text.",
        authorImageUrl: authorImage?.imageUrl || '',
        authorImageHint: authorImage?.imageHint || '',
        projects: typedProjects.map((p) => {
           const mappedImage = Object.values(projectImageMap).find(val => val.imageUrl.includes(p.id));
           return {
                ...p,
                name: p.title,
                description: p.short_description,
                imageUrl: p.image_url,
                imageHint: 'project image',
            };
        }),
    };
}
