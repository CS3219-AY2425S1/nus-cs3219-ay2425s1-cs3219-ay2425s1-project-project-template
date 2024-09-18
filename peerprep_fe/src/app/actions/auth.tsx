"use server";

import { FormState } from "@/app/lib/definitions";

export async function signup(state: FormState, formData: FormData) {
  console.log("signup", state, formData);
}

export async function login(state: FormState, formData: FormData) {
  console.log("login", state, formData);
}
