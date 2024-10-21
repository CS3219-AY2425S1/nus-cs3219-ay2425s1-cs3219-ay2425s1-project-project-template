"use server";

import { sessionOptions, SessionData, defaultSession } from "./lib";
import { getIronSession } from "iron-session";
import { env } from "next-runtime-env";
import { cookies } from "next/headers";

const USER_SERVICE_URL = env("NEXT_PUBLIC_USER_SERVICE_URL");

export const getSession = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }
  return session;
};

export const login = async (
    formData: FormData
  ) => {
    const session = await getSession();

    const formEmail = formData.get("email") as string;
    const formPassword = formData.get("password") as string;

    // Make the login request to your API
    const response = await fetch(`${USER_SERVICE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formEmail,
        password: formPassword,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      // Set session data
      session.userId = data.data.id; // Get user ID from the response
      session.username = data.data.username; // Get username from the response
      session.isLoggedIn = true;
      session.accessToken = data.data.accessToken; // Store the access token in the session

      await session.save();
      return { status: "success", message: "Login successful." }; // Return success status
    } else {
      // Handle error response (e.g., show error message)
      const errorData = await response.json();
      return { status: "error", message: errorData.message || "Login failed." }; // Return error status
    }
  };



  export const logout = async () => {
    const session = await getSession();
    session.destroy();
    return { status: "success", message: "Logged out successfully." }; // Return success status
  };


  export const signUp = async (
    formData: FormData
  ) => {

    const formUsername = formData.get("username") as string;
    const formEmail = formData.get("email") as string;
    const formPassword = formData.get("password") as string;

    // Make the signup request to your API
    const response = await fetch(`${USER_SERVICE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formUsername,
        email: formEmail,
        password: formPassword,
      }),
    });

    if (response.ok) {
      return { status: "success", message: "User registered successfully." }; // Return success status
    } else {
      // Handle error response (e.g., show error message)
      const errorData = await response.json();
      return { status: "error", message: errorData.message || "Sign up failed." }; // Return error status
    }
  };

