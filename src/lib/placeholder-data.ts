
import type { PortfolioData, Project, PersonalInfo, Education, Skill, Experience, ContactDetails, Social, Achievement } from './types';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export async function getCollectionData<T>(collectionName: string): Promise<T[]> {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

export async function getDocumentData<T>(collectionName: string, docId: string): Promise<T | null> {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        if(Object.keys(data).length > 0) return data as T;
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
    const cvLinkDoc = await getDocumentData<{ url: string }>('site-data', 'cv-link');


    return {
        personalInfo: personalInfo!,
        education: education,
        skills: skills,
        experience: experience,
        contactDetails: {
            ...contactDetails!,
            contactMeLink: cvLinkDoc?.url || ''
        },
        socials: socials,
        achievements: achievements,
        aboutMe: aboutMeDoc?.content || "Default about me text.",
        authorImageUrl: authorImageDoc?.url || '',
        authorImageHint: authorImageDoc?.hint || '',
        projects: projects.map((p) => {
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
