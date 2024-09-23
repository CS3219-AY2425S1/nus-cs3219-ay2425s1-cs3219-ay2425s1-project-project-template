// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBveF87hZpIPP62cGW14eQZbZGF_-tfnC0",
  authDomain: "peerprep-d536b.firebaseapp.com",
  projectId: "peerprep-d536b",
  storageBucket: "peerprep-d536b.appspot.com",
  messagingSenderId: "1083435191299",
  appId: "1:1083435191299:web:729955ef95c6d89fd59236",
  measurementId: "G-0S0XJDXGX7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
