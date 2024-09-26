"use server";

import dotenv from "dotenv";
import { FormState } from "../lib/definitions";

dotenv.config();

// TODO: RSA handshake + AES encryption
export async function signup(state: FormState, formData: FormData) {
  // TODO: Validate form data

  const data = {
    username: `${formData.get("username")}`,
    email: `${formData.get("email")}`,
    password: `${formData.get("password")}`,
  };

  const response = await fetch(
    `http://gateway-service:${process.env.API_GATEWAY_PORT}/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  try {
    const data = await response.json();
    if (data.token) {
      return {
        message: data.token,
      };
    } else {
      return {
        errors: {
          errorMessage: data.error,
        },
      };
    }
  } catch (error) {
    console.error(`error: ${error}`);
    return {
      errors: {
        errorMessage: data.error
          ? data.error
          : "An error occurred while signing up",
      },
    };
  }
}

export async function login(state: FormState, formData: FormData) {
  // TODO: Validate form data
  const data = {
    username: `${formData.get("username")}`,
    password: `${formData.get("password")}`,
  };

  const response = await fetch(
    `http://gateway-service:${process.env.API_GATEWAY_PORT}/auth/signin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  try {
    const data = await response.json();
    if (data.token) {
      return {
        message: data.token,
      };
    } else {
      return {
        errors: {
          errorMessage: data.error
            ? data.error
            : "An error occurred while logging in",
        },
      };
    }
  } catch (error) {
    console.error(`error: ${error}`);
    return {
      errors: {
        errorMessage: "An error occurred while logging in",
      },
    };
  }
}
