// frontend/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBdWElFjNB2pZcL8-FlKNyyzz90jdgCnTg",
  authDomain: "cinephile-71b4e.firebaseapp.com",
  projectId: "cinephile-71b4e",
  storageBucket: "cinephile-71b4e.firebasestorage.app",
  messagingSenderId: "757285002948",
  appId: "1:757285002948:web:91ea0730f0057625a47391",
  measurementId: "G-21HKC5VD1G",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.addScope("profile");
googleProvider.addScope("email");

export default app;
