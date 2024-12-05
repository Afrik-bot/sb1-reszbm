import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyBq-DPcggmKJYjpqBbT3HzZUgAjf204x_U",
  authDomain: "lawlink2-38e49.firebaseapp.com",
  projectId: "lawlink2-38e49",
  storageBucket: "lawlink2-38e49.firebasestorage.app",
  messagingSenderId: "359686521204",
  appId: "1:359686521204:web:8fc96612fb3aca3cae6c21",
  measurementId: "G-1ZCJQ77BS8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;