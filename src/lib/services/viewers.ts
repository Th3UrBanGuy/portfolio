
'use server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, orderBy, query } from 'firebase/firestore';
import type { ViewerData } from '@/lib/types';

export async function recordViewer(viewerData: Omit<ViewerData, 'id' | 'timestamp'>): Promise<void> {
    try {
        await addDoc(collection(db, "viewers"), {
            ...viewerData,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Error writing document to Firestore: ", error);
    }
}

export async function getViewers(): Promise<ViewerData[]> {
    try {
        const viewersCollection = collection(db, "viewers");
        const q = query(viewersCollection, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const viewers: ViewerData[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            viewers.push({
                id: doc.id,
                ...data,
                timestamp: data.timestamp?.toDate()
            } as ViewerData);
        });
        return viewers;
    } catch (error) {
        console.error("Error getting documents from Firestore: ", error);
        return [];
    }
}
