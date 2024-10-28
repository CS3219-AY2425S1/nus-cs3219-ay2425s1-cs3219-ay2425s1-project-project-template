import { UserCredential, getAuth, onAuthStateChanged } from "firebase/auth"; // Import UserCredential type
import { SuccessObject, callUserFunction } from "@/lib/utils";

export async function addToUserCollection(userCredential: UserCredential, username: string): Promise<SuccessObject> {
    const { uid, email, displayName } = userCredential.user;
    // Prepare the data to send in the request body
    const userData = {
        uid,
        email,
        displayName: displayName || '', // Use an empty string if displayName is not provided
        username: username,
    };
    console.log("sending user to collection..." + userData)
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
      
      console.log(result)
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