import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyD8Jn_pGJ-SBiDsBjys0DzA1CiIElTebbE",
  authDomain: "mmshub-79800.firebaseapp.com",
  projectId: "mmshub-79800",
  storageBucket: "mmshub-79800.firebasestorage.app",
  messagingSenderId: "688169155815",
  appId: "1:688169155815:web:ecfd75c3a19834f2bdb642",
  measurementId: "G-7W5ER16DZ3"
};

let app: any = null;
let db: any = null;
let auth: any = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.warn('Firebase initialization in offline/fallback mode:', error);
}

export { app, db, auth };
