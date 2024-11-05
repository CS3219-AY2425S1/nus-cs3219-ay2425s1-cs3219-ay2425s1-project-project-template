import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { auth } from "../config/firebaseConfig";

export const HTTP_SERVICE_USER =
  import.meta.env.VITE_USER_SERVICE_BACKEND_URL || "http://localhost:5001";
export const HTTP_SERVICE_QUESTION =
  import.meta.env.VITE_QUESTION_SERVICE_BACKEND_URL || "http://localhost:5002";
export const HTTP_SERVICE_COLLAB =
  import.meta.env.VITE_COLLAB_SERVICE_BACKEND_URL || "http://localhost:5004";
export const HTTP_SERVICE_HISTORY =
  import.meta.env.VITE_HISTORY_SERVICE_BACKEND_URL || "http://localhost:5005";

export const WS_SERVICE_COLLAB =
  import.meta.env.VITE_COLLAB_SERVICE_WS_BACKEND_URL || "ws://localhost:5004";

// Function to get the current user's token
export const getToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    return token;
  }
  return null;
};

// Function to get the current user's UID
export const getUid = (): string | null => {
  const user = auth.currentUser;
  if (user) {
    const uid = user.uid;
    return uid;
  }
  return null;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface IDictionary<T> {
  [key: string]: T;
}

export type SuccessObject = {
  success: boolean;
  data?: any;
  error?: any;
};

export function isSubset<T>(subset: Set<T>, superset: Set<T>): boolean {
  // Iterate over each element in the subset
  for (let item of subset) {
    // Check if the element exists in the superset
    if (!superset.has(item)) {
      return false; // Return false if any element is not found
    }
  }
  return true; // Return true if all elements are found
}

// Utility function for faking delaying execution
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Utility function for making fetch requests with credentials
export async function callFunction(
  serviceName: string,
  functionName: string,
  method: string = "GET",
  body?: any
): Promise<SuccessObject> {
  const url = `${serviceName}/${functionName}`;
  const token = await getToken();
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  console.log(response);

  // Check for empty response
  const data = await response.json().catch(() => ({ success: true }));
  if (!response.ok) {
    return { success: false, error: data.message };
  }

  return { success: true, data: data };
}
