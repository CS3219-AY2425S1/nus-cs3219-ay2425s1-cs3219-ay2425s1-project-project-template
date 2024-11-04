import { collabServiceUri } from "@/lib/api/api-uri";

export const getChatHistory = async (roomId: string) => {
  const response = await fetch(
    `${collabServiceUri(window.location.hostname)}/collab/chat-history/${roomId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};
