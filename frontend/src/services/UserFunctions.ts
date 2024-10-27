import { UserCredential, getAuth, onAuthStateChanged } from "firebase/auth"; // Import UserCredential type
import { SuccessObject, callUserFunction } from "@/lib/utils";
// import { auth } from "../config/firebaseConfig";

export async function listAllUsers(): Promise<SuccessObject> {
    const res = await callUserFunction("admin/users");

    return res;
}

export async function addToUserCollection(userCredential: UserCredential): Promise<SuccessObject> {
    const { uid, email, displayName } = userCredential.user;
    // Prepare the data to send in the request body
    const userData = {
        uid,
        email,
        displayName: displayName || '', // Use an empty string if displayName is not provided
    };
    console.log("sending user to collection...")
    const res = await callUserFunction("user/addToUserCollection", "POST", userData);

    return res;
}

export async function fetchAdminStatus(): Promise<SuccessObject> {
    const auth = getAuth();

    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const token = await user.getIdToken(true);
                    const res = await callUserFunction("admin/checkAdminStatus", "GET", undefined, {
                        Authorization: `Bearer ${token}`,
                    });
                    resolve(res);
                } catch (error: any) {
                    console.error("Error fetching admin status:", error);
                    resolve({ success: false, error: error.message });
                }
            } else {
                console.log("No user is currently logged in.");
                resolve({ success: false, error: "No user is currently logged in." });
            }
        });
    });
}

// export async function fetchAdminStatus(): Promise<SuccessObject> {
//     const user = getAuth().currentUser; // Get the current user
//     console.log("user in fetchAdminStatus function is " + user)
//     if (!user) {
//         return { success: false, error: 'No user is currently logged in.' }; // Handle case when user is not logged in
//     }

//     try {
//         const token = await user.getIdToken(true); // Get a fresh token
//         const res = await callUserFunction("admin/checkAdminStatus", "GET", undefined, {
//             Authorization: `Bearer ${token}`,
//         });

//         return res; // Return the response from the backend
//     } catch (error: any) {
//         console.error("Error fetching admin status:", error);
//         return { success: false, error: error.message }; // Handle errors appropriately
//     }
// }

// export async function getUserEntry(): Promise<SuccessObject> {

// }
