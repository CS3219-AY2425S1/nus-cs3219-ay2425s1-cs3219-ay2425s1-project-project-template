import axios from "axios";
import { io } from "socket.io-client";
import {
  MatchRequest,
  MatchResponse,
  CheckMatchResponse,
  CheckMatchResponseError,
} from "../types/Match";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8002",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  }, // can be used to sent auth token as well
});

export const testSend = async () => {
  try {
    const response = await axiosInstance.get("/test-send");
    return response.data;
  } catch (error) {
    console.error("Error sending test message:", error);
    throw error;
  }
};

export const makeMatchRequest = async (
  matchRequest: MatchRequest
): Promise<MatchResponse> => {
  try {
    const socket = io(`ws://localhost:${process.env.MATCHING_WEBSOCKET_SERVICE_PORT ?? 8008}`, {
      reconnection: false,
      timeout: 3000,
    });
    const responsePromise = new Promise<MatchResponse>((resolve) => {
      socket.once("matchRequestResponse", (response: MatchResponse) => {
        resolve(response);
      });
    });
    socket.emit("matchRequest", matchRequest);
    console.log("Sent match request:", matchRequest);
    return responsePromise;
  } catch (error) {
    console.error("Error sending match request:", error);
    throw error;
  }
};

export const cancelMatchRequest = async (
  matchRequest: MatchRequest
): Promise<MatchResponse> => {
  try {
    const response = await axiosInstance.post("/cancel-match", matchRequest);
    return response.data as MatchResponse;
  } catch (error) {
    console.error("Error sending cancel match request:", error);
    throw error;
  }
};

export const checkMatch = async (
  userId: string
): Promise<CheckMatchResponse | CheckMatchResponseError> => {
  try {
    const response = await axiosInstance.get(`/check-match?userId=${userId}`);

    return response.data as CheckMatchResponse | CheckMatchResponseError;
  } catch (error) {
    console.error("Error checking match:", error);
    throw error;
  }
};
