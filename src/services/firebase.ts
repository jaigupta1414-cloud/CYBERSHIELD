import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer 
} from 'firebase/firestore';

// Load config from firebase-applet-config.json
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with specific database ID if specified in config
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test initial connection as required by Firestore skill
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline status noted.');
    }
  }
}
testFirestoreConnection();

export async function loginWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err: any) {
    console.error('Google Sign-in error:', err);
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeAuth(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Persistent user vault sync in Firestore
export async function saveUserCloudVault(userId: string, data: any): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      lastSynced: new Date().toISOString(),
    }, { merge: true });

    const vaultDocRef = doc(db, 'users', userId, 'vault', 'primary');
    await setDoc(vaultDocRef, {
      ...data,
      lastUpdated: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Error saving to Firestore cloud vault:', err);
    throw err;
  }
}

export async function loadUserCloudVault(userId: string): Promise<any | null> {
  try {
    const vaultDocRef = doc(db, 'users', userId, 'vault', 'primary');
    const snap = await getDoc(vaultDocRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.warn('Error loading from Firestore cloud vault:', err);
    return null;
  }
}
