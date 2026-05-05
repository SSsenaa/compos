import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHCzm-JCZ6jGL67sRkjIcfWA0ydUqTC-E",
  authDomain: "campos-6775f.firebaseapp.com",
  projectId: "campos-6775f",
  storageBucket: "campos-6775f.firebasestorage.app",
  messagingSenderId: "689127363559",
  appId: "1:689127363559:web:f31c1435121915e0d02342",
};

// Prevents Firebase from re-initializing on Next.js hot reloads
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
