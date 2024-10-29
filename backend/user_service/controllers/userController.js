const { db, auth } = require("../config/firebaseConfig.js");
const admin = require('firebase-admin');
const isValidUsername = require("../lib/regex.js")

// Function to create a new user and add them to the Firestore collection
const addToUserCollection = async (req, res) => {
    const { uid, email, displayName, username } = req.body;
    if (!isValidUsername(username)) {
        return res.status(400).json({ success: false, error: "Username must be alphanumeric only." });
    }
    try {
        console.log("Attempting to add user to Firestore:", uid, email, displayName);

        // Add the user entry to Firestore
        await db.collection("users").doc(uid).set({
            uid: uid,
            email: email,
            isAdmin: false,
            username: username,
        });

        console.log("User successfully added to Firestore");
        res.status(201).json({ message: "User created successfully", uid });
    } catch (error) {
        console.error("Error writing to Firestore:", error);
        res.status(500).send("Error adding user to Firestore");
    }
};

const checkAdminStatus = async (req, res) => {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
        // Verify the token
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;

        // Fetch user data from Firestore
        const userDoc = await admin.firestore().collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const userData = userDoc.data();
        const isAdmin = userData.isAdmin || false;

        return res.status(200).json({ success: true, isAdmin });
    } catch (error) {
        console.error('Error checking admin status:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Function to check if a username exists
const checkUsernameExists = async (req, res) => {
    const { username } = req.query; // Get username from query parameters
  
    if (!username) {
      return res.status(400).json({ success: false, error: 'Username is required' });
    }
  
    try {
      const userSnapshot = await db.collection('users').where('username', '==', username).get();
      
      if (userSnapshot.empty) {
        return res.status(200).json({ success: true, exists: false }); // Username is available
      } else {
        return res.status(200).json({ success: true, exists: true }); // Username is taken
      }
    } catch (error) {
      console.error("Error checking username:", error);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  };

const getUsernameByUid = async (req, res) => {
    const { uid } = req.params;
    if (!uid) {
        return res.status(400).json({ success: false, error: 'Username is required' });
      }

    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists) {
            username = userDoc.data().username;
            return res.status(200).json(username);
        } else {
            return res.status(404).json({ error: 'Username not found for the provided uid' });
        }
    } catch (error) {
        console.error("Error retrieving username by uid:", error);
        throw error;
    }

}

module.exports = { addToUserCollection, checkAdminStatus, checkUsernameExists, getUsernameByUid };