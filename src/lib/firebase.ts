import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, initializeFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const envApiKey = (import.meta as any).env?.VITE_FIREBASE_API_KEY || (import.meta as any).env?.REACT_APP_FIREBASE_API_KEY;
const envProjectId = (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || (import.meta as any).env?.REACT_APP_FIREBASE_PROJECT_ID;
const envAuthDomain = (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || (import.meta as any).env?.REACT_APP_FIREBASE_AUTH_DOMAIN;
const envStorageBucket = (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || (import.meta as any).env?.REACT_APP_FIREBASE_STORAGE_BUCKET;

const isRealConfig = Boolean(envApiKey && envProjectId && !envApiKey.includes('DemoKey'));

const firebaseConfig = {
  apiKey: envApiKey || "AIzaSyDemoKeyForMarketplaceFirestore",
  authDomain: envAuthDomain || `${envProjectId || "aistudio-marketplace"}.firebaseapp.com`,
  projectId: envProjectId || "aistudio-marketplace",
  storageBucket: envStorageBucket || `${envProjectId || "aistudio-marketplace"}.firebasestorage.app`,
};

export const isFirebaseConfigured = isRealConfig;

let appInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;

if (isRealConfig) {
  try {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    try {
      firestoreInstance = initializeFirestore(appInstance, {
        experimentalAutoDetectLongPolling: true,
      });
    } catch {
      firestoreInstance = getFirestore(appInstance);
    }
    authInstance = getAuth(appInstance);
  } catch (err) {
    console.warn("Firebase initialization skipped:", err);
  }
}

export const app: FirebaseApp | null = appInstance;
export const db: Firestore | null = firestoreInstance;
export const auth: Auth | null = authInstance;

export default app;
