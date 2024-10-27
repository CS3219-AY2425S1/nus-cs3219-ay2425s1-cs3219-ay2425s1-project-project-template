import { UserCredential, getAuth, onAuthStateChanged } from "firebase/auth"; // Import UserCredential type
import { SuccessObject, callUserFunction } from "@/lib/utils";

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
