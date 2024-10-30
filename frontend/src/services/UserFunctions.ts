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
    const res = await callUserFunction("admin/checkAdminStatus", "GET");
    return res
}
