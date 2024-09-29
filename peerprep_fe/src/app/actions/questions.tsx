"use server";

import dotenv from "dotenv";
import { parseFormData } from "../utility/questionsHelper";
import { FormState } from "../types/AuthTypes";

dotenv.config();

type Response =
  | {
      message?: string;
      errors?: {
        errorMessage?: string[];
      };
    }
  | undefined;

export type FormRequest = (
  token: string | null,
  formState: Response,
  formData: FormData
) => Promise<Response>;

export async function getQuestions(token?: string | null) {
  const response = await fetch(
    `http://gateway-service:${process.env.API_GATEWAY_PORT}/api/questions/questions`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
    }
  );

  try {
    const data = await response.json();
    console.log(data);
    return {
      message: data,
      errors: {
        errorMessage: ["Unable to get questions"],
      },
    };
  } catch (error) {
    console.error(error);
  }
}

export async function editQuestion(
  question: QuestionDto,
  token: string | null,
  formState: Response,
  formData: FormData
) {
  const { _id, ...rest } = question;
  const questionData = parseFormData(formData);

  const response = await fetch(
    `http://gateway-service:${process.env.API_GATEWAY_PORT}/api/questions/questions/${_id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify(questionData),
    }
  );

  try {
    const result = await response.json();
    if (response.ok) {
      return {
        message: result,
      };
    } else {
      return {
        errors: {
          errorMessage: result,
        },
      };
    }
  } catch (error) {
    console.error(error);
  }
}

export async function addQuestion(
  token: string | null,
  formState: Response,
  formData: FormData
) {
  // Helper function to ensure the formData value is a string
  const questionData = parseFormData(formData);

  const response = await fetch(
    `http://gateway-service:${process.env.API_GATEWAY_PORT}/api/questions/questions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify(questionData),
    }
  );

  try {
    const result = await response.json();
    if (response.ok) {
      return {
        message: result,
      };
    } else {
      return {
        errors: {
          errorMessage: result,
        },
      };
    }
  } catch (error) {
    return {
      errors: {
        errorMessage: "An error occurred while adding the question.",
      },
    };
  }
}

export async function deleteQuestion(id: string, token?: string | null) {
  const response = await fetch(
    `http://gateway-service:${process.env.API_GATEWAY_PORT}/api/questions/questions/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
    }
  );

  try {
    const data = await response.json();
    console.log(data);
    return {
      message: data,
      errors: {
        questions: [`${data.message}`],
      },
    };
  } catch (error) {
    console.error(error);
  }
}
