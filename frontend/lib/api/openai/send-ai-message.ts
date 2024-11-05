import { AuthType, collabServiceUri } from "@/lib/api/api-uri";

export const sendAiMessage = async (message: string) => {
  const response = await fetch(
    `${collabServiceUri(window.location.hostname, AuthType.Private)}/collab/send-ai-message`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message }),
    }
  );
  return response;
};
