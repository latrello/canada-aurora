
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  // 注意：process.env.API_KEY 必須是有效的 Firebase Web API Key
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
    console.warn("Firebase 匿名登入失敗，目前處於離線預覽模式。");
  });
} catch (error) {
  console.error("Firebase 初始化失敗。請檢查 API_KEY 是否正確：", error);
}

export { db, storage, auth };
