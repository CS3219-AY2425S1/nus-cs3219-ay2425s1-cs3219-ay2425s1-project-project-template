import { collabServiceUri } from "@/lib/api/api-uri";

export const getQuestionId = async (roomId: string) => {
  const response = await fetch(
    `${collabServiceUri(window.location.hostname)}/collab/rooms/${roomId}/questionId`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};
