"use server";

import dotenv from "dotenv";
import { FormState } from "../lib/definitions";

dotenv.config();

export async function addQuestion(
  state: FormState,
  formData: FormData,
  token: String
) {
  // Helper function to ensure the formData value is a string
  const getStringValue = (value: FormDataEntryValue | null): string => {
    return typeof value === "string" ? value : "";
  };

  // Parse form data into the correct format
  const topics = getStringValue(formData.get("topic"))
    .split(",")
    .map((item) => item.trim());

  const examples = getStringValue(formData.get("examples"))
    .split(";")
    .map((item) => {
      const [input, output, explanation] = item.split("|");
      return {
        input: input.trim(),
        output: output.trim(),
        explanation: explanation ? explanation.trim() : undefined,
      };
    });

  const constraints = getStringValue(formData.get("constraints"))
    .split(";")
    .map((item) => item.trim());

  // Prepare the data to be sent
  const data = {
    title: getStringValue(formData.get("title")),
    description: getStringValue(formData.get("description")),
    difficultyLevel: getStringValue(formData.get("difficultyLevel")), // Should be validated on the frontend to be one of "Easy", "Medium", or "Hard"
    topic: topics,
    examples: examples,
    constraints: constraints,
  };

  const port = process.env.QUESTION_SERVICE_PORT || "3000"; // Fallback to port 3000 if undefined
  const response = await fetch(`http://gateway-service:${port}/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  try {
    const result = await response.json();
    if (result.token) {
      return {
        message: result.token,
      };
    } else {
      return {
        errors: {
          errorMessage: result.error
            ? result.error
            : "An error occurred while adding the question.",
        },
      };
    }
  } catch (error) {
    console.error(`error: ${error}`);
    return {
      errors: {
        errorMessage: "An error occurred while adding the question.",
      },
    };
  }
}
