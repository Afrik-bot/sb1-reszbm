import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyAXS3ylJE5ofG_6LueH6sp0w5I9VScfPGs",
  authDomain: "lawlink-d7644.firebaseapp.com",
  projectId: "lawlink-d7644",
  storageBucket: "lawlink-d7644.firebasestorage.app",
  messagingSenderId: "681081822419",
  appId: "1:681081822419:web:7b19e8752f173a1d4d4826",
  measurementId: "G-D00QE1B21S"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;