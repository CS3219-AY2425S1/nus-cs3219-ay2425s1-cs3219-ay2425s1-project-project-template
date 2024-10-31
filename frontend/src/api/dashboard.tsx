import { TCombinedSession } from "@/types/dashboard";

// retrieve from .env
const COLLAB_SERVICE = process.env.COLLAB_SERVICE;

export const getUserHistoryData = async (userId: string): Promise<TCombinedSession[]> => {
  const url = `${COLLAB_SERVICE}/api/sessions/${userId}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
