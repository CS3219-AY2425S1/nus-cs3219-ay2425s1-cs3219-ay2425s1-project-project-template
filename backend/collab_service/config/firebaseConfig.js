// This file gets run whenever another file imports it.
// This file sets up and initializes the Firebase Admin SDK with service account credentials.
// It then exports the initialized Firebase Authentication and Firestore instances for use in other modules.
// Documentation can be found here: https://firebase.google.com/docs/firestore/quickstart

const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./firebaseCredentials.json'); // Path to your service account key


initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth();
const db = getFirestore();

module.exports = { auth, db };
