import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from './firebase-config';

console.log('✅ Firebase 설정 로드:', {
  projectId: firebaseConfig.projectId,
  apiKey: firebaseConfig.apiKey ? '존재함' : '없음',
  authDomain: firebaseConfig.authDomain
});

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

console.log('✅ Firebase 초기화 완료');

export default app;
