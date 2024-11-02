import { collabServiceUri } from "@/lib/api/api-uri";

export const fetchRoom = async (
  user1_id: string,
  user2_id: string,
  question_id: string
) => {
  const response = await fetch(
    `${collabServiceUri(window.location.hostname)}/collab/create-room`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user1: user1_id,
        user2: user2_id,
        question_id: question_id,
      }),
    }
  );
  return response;
};
