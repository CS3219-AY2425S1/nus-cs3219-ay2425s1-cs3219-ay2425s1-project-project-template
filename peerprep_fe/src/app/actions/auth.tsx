"use server";

import dotenv from "dotenv";
import { FormState } from "../lib/definitions";

dotenv.config();

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
    console.log(data);
    return {
      message: data.token,
      errors: {
        name: ["Name is required"],
        email: ["Email is required"],
        password: ["Password is required"],
      },
    };
  } catch (error) {
    console.error(error);
  }
}

export async function login(state: FormState, formData: FormData) {
  // TODO: Validate form data
  const data = {
    email: `${formData.get("email")}`,
    password: `${formData.get("password")}`,
  };

  const response = await fetch(
    `http://gateway-service:${process.env.API_GATEWAY_PORT}/auth/login`,
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
    console.log(data);
    return {
      message: data.token,
      errors: {
        email: ["Email is required"],
        password: ["Password is required"],
      },
    };
  } catch (error) {
    console.error(error);
  }
}
