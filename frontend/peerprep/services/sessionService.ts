import io from "socket.io-client";
import { env } from "next-runtime-env";

import { getAccessToken } from "../auth/actions";
import { Dispatch } from "react";
import { Socket } from "socket.io-client";
const NEXT_PUBLIC_COLLAB_SERVICE_URL = env("NEXT_PUBLIC_COLLAB_SERVICE_URL");

export let socket: Socket | null = null;

const getToken = async () => {
  const token = await getAccessToken();

  if (!token) {
    console.error("Access token not found");

    return null;
  }

  return token;
};

export const initializeSessionSocket =
async (setLanguage: Dispatch<any>,
       setUsersInRoom: Dispatch<any>,
       setQuestionDescription: Dispatch<any>,
       setQuestionTestcases: Dispatch<any>,
       updateDoc: (arg0: Uint8Array) => void) => {

  const token = await getToken();

  if (!token) return;

  socket = io(NEXT_PUBLIC_COLLAB_SERVICE_URL, {
    auth: { token },
    transports: ["websocket"],
    reconnectionAttempts: 5,
    timeout: 20000,
  });

  socket.connect();

  socket.on("connect", () => {
    console.log("Connected to session service");
  });

  socket.on("initialData", (data: any) => {
    console.log("Populating initial data");
    const { sessionData } = data;
    setLanguage(sessionData.language);
    setUsersInRoom(sessionData.usersInRoom);
    setQuestionDescription(sessionData.questionDescription);
    setQuestionTestcases(sessionData.questionTestcases);
    updateDoc(new Uint8Array(sessionData.yDocUpdate));
  });

  registerUserEvents(setUsersInRoom);



};

const registerUserEvents = async (setUsersInRoom: Dispatch<any>) => {

  if (!socket) return;

  socket.on("userJoined", (data: any) => {
    const { usersInRoom } = data;

    setUsersInRoom(usersInRoom)
  });
  socket.on("userLeft", (data: any) => {
    const { usersInRoom } = data;

    setUsersInRoom(usersInRoom);
  });
};

export const disconnectSocket = async () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const isSocketConnected = async () => {
  return socket ? socket.connected : false;
}

