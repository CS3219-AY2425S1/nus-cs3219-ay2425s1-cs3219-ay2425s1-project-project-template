import io from "socket.io-client";
import { env } from "next-runtime-env";

import { getAccessToken } from "../auth/actions";
const NEXT_PUBLIC_COLLAB_SERVICE_URL = env("NEXT_PUBLIC_COLLAB_SERVICE_URL");

const getToken = async () => {
  const token = await getAccessToken();

  if (!token) {
    console.error("Access token not found");

    return null;
  }

  return token;
};

const initializeSocket = async () => {
  const token = await getToken();

  if (!token) return;

  const socket = io(NEXT_PUBLIC_COLLAB_SERVICE_URL, {
    auth: { token },
    transports: ["websocket"],
    reconnectionAttempts: 5,
    timeout: 20000,
  });

  return socket;
};

export const socket = initializeSocket();

export const checkUserMatchStatus = async () => {
  try {
    const response = await fetch(
      `${NEXT_PUBLIC_COLLAB_SERVICE_URL}/api/session/check`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await getAccessToken()}`,
        },
      },
    );

    if (response.status === 200) {
      return true;
    }
    if (response.status === 204) {
      return false;
    }
    throw new Error(`Unexpected status code: ${response.status}`);
  } catch (error) {
    throw error;
  }
};

export const leaveMatch = async () => {
  try {
    const response = await fetch(
      `${NEXT_PUBLIC_COLLAB_SERVICE_URL}/api/session/leave`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await getAccessToken()}`,
        },
      },
    );

    if (response.status === 200) {
      return;
    }

    throw new Error("Unexpected status code");
  } catch (error) {
    throw error;
  }
};
