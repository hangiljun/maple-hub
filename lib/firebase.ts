import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// 환경 변수 확인
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Firebase 환경 변수가 설정되지 않았습니다!');
  console.log('firebaseConfig:', firebaseConfig);
} else {
  console.log('✅ Firebase 환경 변수 확인됨:', {
    projectId: firebaseConfig.projectId,
    apiKey: firebaseConfig.apiKey ? '존재함' : '없음',
    authDomain: firebaseConfig.authDomain
  });
}

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

console.log('✅ Firebase 초기화 완료');
console.log('Firebase 앱 이름:', app.name);
console.log('Firestore 설정:', {
  type: db.type,
  app: db.app?.name
});

// Firestore 연결 테스트
if (typeof window !== 'undefined') {
  import('firebase/firestore').then(({ collection, getDocs, limit, query }) => {
    console.log('🔍 Firestore 연결 테스트 시작...');
    const testQuery = query(collection(db, 'reviews'), limit(1));
    getDocs(testQuery)
      .then(() => {
        console.log('✅ Firestore 읽기 테스트 성공!');
      })
      .catch((error) => {
        console.error('❌ Firestore 읽기 테스트 실패:', error);
        console.error('에러 코드:', error.code);
        console.error('에러 메시지:', error.message);
      });
  });
}

export default app;
