import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const questionServiceBackendUrl = import.meta.env.VITE_QUESTION_SERVICE_BACKEND_URL || "http://localhost:5002";

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
  functionName: string,
  method: string = "GET",
  body?: any
): Promise<SuccessObject> {
  try {
    const url = `${questionServiceBackendUrl}/${functionName}`;
    const token = sessionStorage.getItem("authToken");
    console.log(token);

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    // Check for empty response
    const data = await response.text();

    if (!data) {
      return { success: true };
    }

    // Parse the JSON data
    const result = JSON.parse(data);

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Fetch error:", error);
    return { success: false, error }; // Handle the error (could also throw or handle differently)
  }
}
