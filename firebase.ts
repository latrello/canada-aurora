
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.API_KEY || "dummy-key",
  authDomain: "canada-aurora-trip.firebaseapp.com",
  projectId: "canada-aurora-trip",
  storageBucket: "canada-aurora-trip.firebasestorage.app",
  messagingSenderId: "aurora-sender-id",
  appId: "aurora-app-id"
};

let db: any = null;
let storage: any = null;
let auth: any = null;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);

  signInAnonymously(auth).catch(err => {
    console.warn("Firebase anonymous sign-in failed. App is running in offline mode.");
  });
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { db, storage, auth };
