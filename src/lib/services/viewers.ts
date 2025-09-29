'use server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, orderBy, query, where, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import type { ViewerData } from '@/lib/types';
import type { RecordViewerInput } from '../schemas/viewer';

export async function recordViewer(viewerData: RecordViewerInput): Promise<void> {
    const { visitorId, ...restData } = viewerData;
    const viewersCollection = collection(db, "viewers");
    const q = query(viewersCollection, where("visitorId", "==", visitorId));

    try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Visitor exists, update their document
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef, {
                visit_count: increment(1),
                last_visit: serverTimestamp(),
                visit_history: arrayUnion(serverTimestamp()),
                // Optionally update other details if they might change
                ip: restData.ip,
                ...restData.clientDetails,
                ...restData
            });
        } else {
            // New visitor, create a new document
            await addDoc(viewersCollection, {
                ...restData,
                visitorId: visitorId,
                first_visit: serverTimestamp(),
                last_visit: serverTimestamp(),
                visit_history: [serverTimestamp()],
                visit_count: 1,
            });
        }
    } catch (error) {
        console.error("Error writing or updating document in Firestore: ", error);
    }
}

export async function getViewers(): Promise<ViewerData[]> {
    try {
        const viewersCollection = collection(db, "viewers");
        const q = query(viewersCollection, orderBy("last_visit", "desc"));
        const querySnapshot = await getDocs(q);
        const viewers: ViewerData[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const visitHistory = (data.visit_history || []).map((ts: any) => ts.toDate());
            viewers.push({
                id: doc.id,
                ...data,
                first_visit: data.first_visit?.toDate(),
                last_visit: data.last_visit?.toDate(),
                visit_history: visitHistory,
            } as ViewerData);
        });
        return viewers;
    } catch (error) {
        console.error("Error getting documents from Firestore: ", error);
        return [];
    }
}
