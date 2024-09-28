"use server";

import dotenv from "dotenv";

dotenv.config();

interface Response {
  message: any;
  errors: {
    errorMessage: string[];
  };
}

export type FormRequest = (
  token: string | null,
  formData: FormData
) => Promise<Partial<Response>>;

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
  formData: FormData
) {
  const { _id, ...questionDetails } = question;

  const response = await fetch(
    `http://gateway-service:${process.env.API_GATEWAY_PORT}/api/questions/questions/${_id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify(questionDetails),
    }
  );

  try {
    const data = await response.json();
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

export async function addQuestion(token: string | null, formData: FormData) {
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

  const response = await fetch(
    `http://gateway-service:${process.env.API_GATEWAY_PORT}/api/questions/questions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

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
