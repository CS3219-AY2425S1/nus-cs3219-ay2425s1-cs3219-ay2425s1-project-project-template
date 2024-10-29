import { UserCredential, getAuth, onAuthStateChanged } from "firebase/auth"; // Import UserCredential type
import { SuccessObject, callUserFunction } from "@/lib/utils";

export async function addToUserCollection(userCredential: UserCredential, username: string): Promise<SuccessObject> {
    const { uid, email } = userCredential.user;
    // Prepare the data to send in the request body
    const userData = {
        uid,
        email,
        username: username,
    };
    
    const res = await callUserFunction("user/addToUserCollection", "POST", userData);

    return res;
}

export async function fetchAdminStatus(): Promise<SuccessObject> {
    const auth = getAuth();

    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    
                    const res = await callUserFunction("admin/checkAdminStatus", "GET");
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

export const doesUserExist = async (username: string) => {
    try {
      const result = await callUserFunction(`check-username?username=${encodeURIComponent(username)}`);
      
      if (result.success) {
        return result.data.exists; // returns true if username is taken
      } else {
        throw new Error('Failed to check username');
      }
    } catch (error) {
      console.error("Error checking username:", error);
      throw error; // rethrow the error for further handling
    }
  };

export async function getUsernameByUid(uid: string) {
    try {
        console.log("UID before sending: " + uid)
        const result = await callUserFunction(`user/username/${uid}`)
        if (result.success) {
            console.log(result)
            return result.data;
        } else {
            throw new Error(result.error || "Unable to fetch username");
        }
    } catch (error) {
        console.error("Error checking uid for username:", error);
        throw error; // rethrow the error for further handling
    }
}