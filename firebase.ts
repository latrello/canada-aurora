
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, signInAnonymously } from 'firebase/auth';

// 這些資訊通常來自 Firebase 控制台的專案設定
// 為了演示，我們使用環境變數或預設結構
const firebaseConfig = {
  apiKey: process.env.API_KEY, // 使用注入的 API Key
  authDomain: "canada-aurora-trip.firebaseapp.com",
  projectId: "canada-aurora-trip",
  storageBucket: "canada-aurora-trip.firebasestorage.app",
  messagingSenderId: "aurora-sender-id",
  appId: "aurora-app-id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// 執行匿名登入以確保能讀寫測試模式下的資料
signInAnonymously(auth).catch(err => console.error("Firebase Auth Error:", err));
