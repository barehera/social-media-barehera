// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAbYIz1Amn6QP39KfvwdEvImeX7UTN6k6I",
  authDomain: "instagram-clone-c9ee1.firebaseapp.com",
  projectId: "instagram-clone-c9ee1",
  storageBucket: "instagram-clone-c9ee1.appspot.com",
  messagingSenderId: "814122607711",
  appId: "1:814122607711:web:5c5b7447943354aeb427ea",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
