import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const questionServiceBackendUrl =
	import.meta.env.VITE_QUESTION_SERVICE_BACKEND_URL || "http://localhost:5002";
const collabServiceBackendUrl =
	import.meta.env.VITE_COLLAB_SERVICE_BACKEND_URL || "http://localhost:5004";

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
	const url = `${questionServiceBackendUrl}/${functionName}`;
	const token = sessionStorage.getItem("authToken");

	const response = await fetch(url, {
		method,
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	// Check for empty response
	const data = await response.json().catch(() => ({ success: true }));

	if (!response.ok) {
		return { success: false, error: data.message };
	}

	return { success: true, data: data };
}

// collab-service ver: Utility function for making fetch requests with credentials
export async function collabServiceCallFunction(
	functionName: string,
	method: string = "POST",
	body?: any,
): Promise<SuccessObject> {
	const url = `${collabServiceBackendUrl}/${functionName}`;
	const token = sessionStorage.getItem("authToken");

	const response = await fetch(url, {
		method: method,
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
