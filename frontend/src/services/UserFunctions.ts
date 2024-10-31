import { UserCredential } from "firebase/auth"; // Import UserCredential type
import { SuccessObject, callFunction, HTTP_SERVICE_USER } from "@/lib/utils";

export async function addToUserCollection(userCredential: UserCredential): Promise<SuccessObject> {
    const { uid, email, displayName } = userCredential.user;
    // Prepare the data to send in the request body
    const userData = {
        uid,
        email,
        displayName: displayName || '', // Use an empty string if displayName is not provided
    };
    console.log("sending user to collection...")
    const res = await callFunction(HTTP_SERVICE_USER, "user/addToUserCollection", "POST", userData);

    return res;
}

export const fetchAdminStatus = async () => {
    const res = await callFunction(HTTP_SERVICE_USER, "admin/checkAdminStatus", "GET");
    return res
}

export async function getUsernameByUid(uid: string) {
    try {
        const result = await callFunction(HTTP_SERVICE_USER, `user/username/${uid}`)
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
