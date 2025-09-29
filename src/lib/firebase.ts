import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "studio-6735051727-ce0b9",
  "appId": "1:907990168113:web:26c266b21874efa4635b10",
  "apiKey": "AIzaSyBu4iXxDcpF2u7h9bBxjkOCs2gWwY-ihQY",
  "authDomain": "studio-6735051727-ce0b9.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "907990168113"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
