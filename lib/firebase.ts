import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

/**
 * Firebase client initialisation.
 *
 * Config comes from NEXT_PUBLIC_FIREBASE_* env vars (safe to expose — these
 * are public client keys; real access control lives in Firestore security
 * rules, see firestore.rules). Initialisation is lazy and guarded so the site
 * still builds and renders even before the env vars are set — the chat widget
 * degrades gracefully instead of crashing the whole app.
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** True only when every required config value is present. */
export const isFirebaseConfigured =
  !!firebaseConfig.apiKey &&
  !!firebaseConfig.projectId &&
  !!firebaseConfig.appId &&
  !!firebaseConfig.authDomain;

let app: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  if (app) return app;
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return app;
}

/** Firestore handle, or null when Firebase isn't configured yet. */
export function getDb(): Firestore | null {
  if (dbInstance) return dbInstance;
  const a = getFirebaseApp();
  if (!a) return null;
  dbInstance = getFirestore(a);
  return dbInstance;
}

/** Auth handle, or null when Firebase isn't configured yet. */
export function getFirebaseAuth(): Auth | null {
  if (authInstance) return authInstance;
  const a = getFirebaseApp();
  if (!a) return null;
  authInstance = getAuth(a);
  return authInstance;
}
