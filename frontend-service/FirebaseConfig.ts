// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9UUF76Bz_9GmmylPRviSL_uxsFXfsaJI",
  authDomain: "cs3219-g21.firebaseapp.com",
  databaseURL:
    "https://cs3219-g21-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cs3219-g21",
  storageBucket: "cs3219-g21.appspot.com",
  messagingSenderId: "958024239459",
  appId: "1:958024239459:web:72f1c7396a441127d72b56",
  measurementId: "G-RWHNR4RB38",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_FIRESTORE = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
export const FIREBASE_DB = getDatabase(FIREBASE_APP)
