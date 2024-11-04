import { collabServiceUri } from "@/lib/api/api-uri";

export const getRoomsByUser = async (userId: string) => {
  const response = await fetch(
    `${collabServiceUri(window.location.hostname)}/collab/rooms/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};
