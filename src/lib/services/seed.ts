
'use server';
import { db } from '../firebase';
import { collection, doc, writeBatch, setDoc } from 'firebase/firestore';

// Import data from JSON files
import achievementsData from '../data/achievements.json';
import contactDetailsData from '../data/contact-details.json';
import educationData from '../data/education.json';
import experienceData from '../data/experience.json';
import personalInfoData from '../data/personal-info.json';
import projectsData from '../data/projects.json';
import skillsData from '../data/skills.json';
import socialsData from '../data/socials.json';

const aboutMeContent = {
    content: "I'm a hands-on tech explorer who dives into any technical issue, finds innovative solutions, and stays updated with the latest tech trends - a true 'Jugadu Technophile'. Since 2016, I've been solving diverse tech issues using creative methods and AI tools, and I'm always exploring new technologies."
};
const authorImageData = {
    url: "https://lh3.googleusercontent.com/pw/AP1GczPrhGLh1N2EYuB50kQaEeqIKFAKFh1yMtS6rcvyZsR2oW08wqatIORke9dSmfvq-_OCnExu-aAcEpgdYrssnYZ8aTzCGkTJ41KrdunlF8ZuYvNSc4l3rSuZsG0UsAETf64WL3v471RSkseWarjrH4pRlQ=w1080-h975-s-no-gm?authuser=0",
    hint: "author portrait lake"
};
const cvLinkData = {
    url: "https://alahimajnurosama.github.io/resume"
}

async function seedCollection(collectionName: string, data: any[]) {
    const batch = writeBatch(db);
    const collectionRef = collection(db, collectionName);
    console.log(`Seeding ${collectionName}...`);
    data.forEach(item => {
        const docRef = doc(collectionRef, item.id);
        batch.set(docRef, item);
    });
    await batch.commit();
    console.log(`Successfully seeded ${data.length} documents into ${collectionName}.`);
}

async function seedDocument(collectionName: string, docId: string, data: any) {
    const docRef = doc(db, collectionName, docId);
    console.log(`Seeding document ${collectionName}/${docId}...`);
    await setDoc(docRef, data);
    console.log(`Successfully seeded document ${collectionName}/${docId}.`);
}

export async function seedDatabase() {
    console.log('--- Starting Database Seeding Process ---');

    await seedCollection('achievements', achievementsData);
    await seedCollection('education', educationData);
    await seedCollection('experience', experienceData);
    await seedCollection('projects', projectsData);
    await seedCollection('skills', skillsData);
    await seedCollection('socials', socialsData);
    
    await seedDocument('site-data', 'personal-info', personalInfoData);
    await seedDocument('site-data', 'contact-details', contactDetailsData);
    await seedDocument('site-data', 'about-me', aboutMeContent);
    await seedDocument('site-data', 'author-image', authorImageData);
    await seedDocument('site-data', 'cv-link', cvLinkData);

    console.log('--- Database Seeding Process Completed ---');
}
