// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // If using Firestore
import { getStorage } from 'firebase/storage'; // If using Firebase Storage
import { getAnalytics } from 'firebase/analytics'; // Optional, if you are using analytics

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsHIrpIDMmmCYY802GDF8aA7lcJ1Aa40U",
  authDomain: "peerprep-g02.firebaseapp.com",
  projectId: "peerprep-g02",
  storageBucket: "peerprep-g02.appspot.com",
  messagingSenderId: "1079323726684",
  appId: "1:1079323726684:web:56bd9bfdad2291e7ed6799",
  measurementId: "G-6HZXZE70J3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services if you are using them
const auth = getAuth(app);
const firestore = getFirestore(app); // If using Firestore
const storage = getStorage(app); // If using Firebase Storage
const analytics = getAnalytics(app); // Optional, if using analytics

// Set authentication persistence to session
const setAuthPersistence = async () => {
  try {
    await setPersistence(auth, browserSessionPersistence);
    console.log("Authentication persistence set to session.");
  } catch (error) {
    console.error("Error setting authentication persistence:", error);
  }
};

// Call the function to set persistence
setAuthPersistence();

export { app, auth, firestore, storage, analytics, signOut };
