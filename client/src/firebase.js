// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration from your live website
const firebaseConfig = {
  apiKey: "AIzaSyBf-ZFhG8tesNnulOqO_zppcU5wC9pj6MM",
  authDomain: "city-drive-953c0.firebaseapp.com",
  projectId: "city-drive-953c0",
  storageBucket: "city-drive-953c0.firebasestorage.app",
  messagingSenderId: "83138806155",
  appId: "1:83138806155:web:e7d967dbeddee9e47daf8e",
  measurementId: "G-RB3LNG1J3K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (only in production)
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

export { analytics };
export default app;