
import type { PortfolioData, Project, PersonalInfo, Education, Skill, Experience, ContactDetails, Social, Achievement, CustomLink, PageTitle, PrivateInfo, ProjectBundle } from './types';
import { ALL_PAGES, type Page } from './schemas/page';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';

export async function getCollectionData<T extends { order?: number }>(collectionName: string, orderByField?: string): Promise<T[]> {
  try {
    const collectionRef = collection(db, collectionName);
    const q = orderByField ? query(collectionRef, orderBy(orderByField)) : collectionRef;
    const querySnapshot = await getDocs(q);
    
    // Assign order if it's missing (for backward compatibility)
    return querySnapshot.docs.map((doc, index) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            order: data.order !== undefined ? data.order : index,
        } as T;
    });
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
            if(Object.keys(data).length > 0) return { id: docSnap.id, ...data } as T;
            return { id: docSnap.id, ...data } as T;
        }
        return null;
    } catch(e) {
        console.error(`Error fetching document ${collectionName}/${docId}:`, e);
        return null;
    }
}

export async function getPortfolioData(): Promise<PortfolioData> {
    const defaultPersonalInfo = { name: '', dob: '', bloodGroup: '', nationality: '', occupation: '', status: '', hobby: '', aimInLife: '' };
    const defaultContactDetails = { emails: [], phoneNumbers: [] };
    const defaultPrivateInfo = { sections: [], documents: [] };
    const defaultPageSequence = { activePages: ALL_PAGES, hiddenPages: [] };

    try {
        const [
            personalInfo,
            privateInfo,
            education,
            skills,
            experience,
            contactDetails,
            socials,
            achievements,
            projects,
            projectBundles,
            aboutMeDoc,
            authorImageDoc,
            cvLinkDoc,
            customLinks,
            pageTitles,
            pageSequenceDoc,
        ] = await Promise.all([
            getDocumentData<PersonalInfo>('site-data', 'personal-info'),
            getDocumentData<PrivateInfo>('site-data', 'private-info'),
            getCollectionData<Education>('education', 'order'),
            getCollectionData<Skill>('skills'),
            getCollectionData<Experience>('experience', 'order'),
            getDocumentData<ContactDetails>('site-data', 'contact-details'),
            getCollectionData<Social>('socials'),
            getCollectionData<Achievement>('achievements', 'order'),
            getCollectionData<Project>('projects'),
            getCollectionData<ProjectBundle>('project-bundles'),
            getDocumentData<{ content: string }>('site-data', 'about-me'),
            getDocumentData<{ url: string, hint: string }>('site-data', 'author-image'),
            getDocumentData<{ url: string }>('site-data', 'cv-link'),
            getCollectionData<CustomLink>('custom-links'),
            getCollectionData<PageTitle>('page-titles'),
            getDocumentData<{ activePages: Page[], hiddenPages: Page[] } | { sequence: Page[] }>('site-data', 'page-sequence'),
        ]);

        let finalSequence: { activePages: Page[], hiddenPages: Page[] };

        if (pageSequenceDoc) {
            if ('activePages' in pageSequenceDoc) {
                finalSequence = pageSequenceDoc as { activePages: Page[], hiddenPages: Page[] };
            } else if ('sequence' in pageSequenceDoc) {
                const activePages = pageSequenceDoc.sequence;
                const hiddenPages = ALL_PAGES.filter(p => !activePages.includes(p));
                finalSequence = { activePages, hiddenPages };
            } else {
                finalSequence = defaultPageSequence;
            }
        } else {
            finalSequence = defaultPageSequence;
        }

        return {
            personalInfo: personalInfo || defaultPersonalInfo,
            privateInfo: privateInfo || defaultPrivateInfo,
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
            projectBundles: projectBundles || [],
            cvLink: cvLinkDoc?.url || '',
            customLinks: customLinks || [],
            pageTitles: pageTitles || [],
            pageSequence: finalSequence,
        };
    } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
        return {
            personalInfo: defaultPersonalInfo,
            privateInfo: defaultPrivateInfo,
            education: [],
            skills: [],
            experience: [],
            contactDetails: defaultContactDetails,
            socials: [],
            achievements: [],
            aboutMe: "Error loading portfolio data. Please check the connection and configuration.",
            authorImageUrl: 'https://picsum.photos/seed/error/400/500',
            authorImageHint: 'error placeholder',
            projects: [],
            projectBundles: [],
            cvLink: '',
            customLinks: [],
            pageTitles: [],
            pageSequence: defaultPageSequence,
        };
    }
}
