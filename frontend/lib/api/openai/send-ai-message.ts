import { collabServiceUri } from "@/lib/api/api-uri";

export const sendAiMessage = async (message: string) => {
  console.log(`{collabServiceUri(window.location.hostname)}/send-ai-message`);
  console.log(message);
  const response = await fetch(
    `${collabServiceUri(window.location.hostname)}/collab/send-ai-message`,
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
