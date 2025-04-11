// src/firebase/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Using environment variables for improved security
// These values are loaded from .env file
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCEgGKPJ4v92d3Qhz3BNANC_ni-Dvm2B8g",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "prog-87062.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://prog-87062-default-rtdb.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "prog-87062",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "prog-87062.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1092380967587",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:1092380967587:web:8bf552f2ae2e7ce0223516",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-TV4YHV9E7Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Set persistence for better user experience
// auth.setPersistence(browserLocalPersistence);

export { app, auth, db, storage, analytics };
export default app;