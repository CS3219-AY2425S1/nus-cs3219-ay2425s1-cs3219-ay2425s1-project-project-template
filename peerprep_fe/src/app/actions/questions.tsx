"use server";

import dotenv from "dotenv";

dotenv.config();

export async function getQuestions(
    token?: string | null
 ) {
    const response = await fetch(
    `http://gateway-service:${process.env.API_GATEWAY_PORT}/api/questions/questions`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `bearer ${token}`
      },
    }
  );

  try {
    const data = await response.json();
    console.log(data);
    return {
      message: data,
      errors: {
        questions: ["Unable to get questions"]
      },
    };
  } catch (error) {
    console.error(error);
  }
}