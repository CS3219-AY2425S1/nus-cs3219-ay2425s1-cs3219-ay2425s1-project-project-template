import { questionServiceUri } from "@/lib/api/api-uri";

export const getQuestion = async (jwtToken: string, questionId: string) => {
  const response = await fetch(
    `${questionServiceUri(window.location.hostname)}/questions/${questionId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};
