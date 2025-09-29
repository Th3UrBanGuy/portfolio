
import type { PortfolioData, Project, PersonalInfo, Education, Skill, Experience, ContactDetails, Social, Achievement } from './types';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export async function getCollectionData<T>(collectionName: string): Promise<T[]> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  } catch (e) {
    console.error(`Error fetching collection ${collectionName}:`, e);
    return [];
  }
}

export async function getDocumentData<T>(collectionName: string, docId: string): Promise<T | null> {
    try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            // This check handles both empty documents and documents that might just have an ID property from a bad merge
            if(Object.keys(data).length > 0) return data as T;
            return { id: docSnap.id, ...data } as T;
        }
        return null;
    } catch(e) {
        console.error(`Error fetching document ${collectionName}/${docId}:`, e);
        return null;
    }
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
        projects,
        aboutMeDoc,
        authorImageDoc,
    ] = await Promise.all([
        getDocumentData<PersonalInfo>('site-data', 'personal-info'),
        getCollectionData<Education>('education'),
        getCollectionData<Skill>('skills'),
        getCollectionData<Experience>('experience'),
        getDocumentData<ContactDetails>('site-data', 'contact-details'),
        getCollectionData<Social>('socials'),
        getCollectionData<Achievement>('achievements'),
        getCollectionData<Project>('projects'),
        getDocumentData<{ content: string }>('site-data', 'about-me'),
        getDocumentData<{ url: string, hint: string }>('site-data', 'author-image'),
    ]);

    const defaultPersonalInfo = { name: '', dob: '', bloodGroup: '', nationality: '', occupation: '', status: '', hobby: '', aimInLife: '' };
    const defaultContactDetails = { contactMeLink: '', phone: '', emails: [] };

    return {
        personalInfo: personalInfo || defaultPersonalInfo,
        education: education || [],
        skills: skills || [],
        experience: experience || [],
        contactDetails: contactDetails || defaultContactDetails,
        socials: socials || [],
        achievements: achievements || [],
        aboutMe: aboutMeDoc?.content || "Welcome to my portfolio. The content is being loaded.",
        authorImageUrl: authorImageDoc?.url || 'https://picsum.photos/seed/author/400/500',
        authorImageHint: authorImageDoc?.hint || 'placeholder image',
        projects: projects || [],
    };
}
