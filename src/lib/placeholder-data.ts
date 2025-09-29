import type { PortfolioData, Project, ProjectLink, PersonalInfo, Education, Skill, Experience, ContactDetails, Social, Achievement } from './types';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

async function getCollectionData<T>(collectionName: string): Promise<T[]> {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

async function getDocumentData<T>(collectionName: string, docId: string): Promise<T | null> {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        // If the document itself is the entity, return it.
        // This is useful for singleton documents like 'personal-info'
        if(Object.keys(data).length > 0) return data as T;
        // Otherwise, it might be a wrapper, so we return the content if it exists
        return { id: docSnap.id, ...data } as T;
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
    const authorImageDoc = await getDocumentData<{ url: string, hint: string }>('site-data', 'author-image');

    const typedProjects = projects as (Omit<Project, 'imageUrl' | 'imageHint'> & {image_url: string})[];

    return {
        personalInfo: personalInfo!,
        education: education,
        skills: skills,
        experience: experience,
        contactDetails: contactDetails!,
        socials: socials,
        achievements: achievements,
        aboutMe: aboutMeDoc?.content || "Default about me text.",
        authorImageUrl: authorImageDoc?.url || '',
        authorImageHint: authorImageDoc?.hint || '',
        projects: typedProjects.map((p) => {
           return {
                ...p,
                imageUrl: p.image_url,
                imageHint: 'project image',
            };
        }),
    };
}
