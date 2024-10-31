import { UserCredential } from "firebase/auth"; // Import UserCredential type
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

export const fetchAdminStatus = async () => {
    const result = await callUserFunction("admin/checkAdminStatus", "GET");
    if (result.success) {
        return result.data;
    } else {
        throw new Error(result.error || "Unable to fetch admin status");
    }
}

export async function getUsernameByUid(uid: string) {
    try {
        const result = await callUserFunction(`user/username/${uid}`)
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error || "Unable to fetch username");
        }
    } catch (error) {
        console.error("Error checking uid for username:", error);
        throw error; // rethrow the error for further handling
    }
}
