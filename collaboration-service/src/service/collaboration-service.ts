import { Socket } from "socket.io";
import Redis from "ioredis";
import {
  executeCodeWithTestCases,
  executeCode,
} from "./code-execution-service";
import axios from "axios";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const QUESTION_SERVICE_URL =
  process.env.QUESTION_SERVICE_URL || "http://localhost:3002";
const redis = new Redis(REDIS_URL);

// Map to track users in each collaboration room
const roomUsers: { [roomId: string]: string[] } = {};

// Map to store socket IDs to user information
const socketUserInfo: {
  [socketId: string]: {
    userName: string;
    userId: string;
    questionId: string;
    token: string;
  };
} = {};

// Map to track all users who have ever been in each collaboration room
const roomUserHistory: { [roomId: string]: Set<string> } = {};
const sessionStartTime: { [socketId: string]: number } = {}; // Stores the start time in milliseconds
export async function joinCollaborationRoom(
  socket: Socket,
  {
    roomId,
    userName,
    userId,
    questionId,
    token,
  }: {
    roomId: string;
    userName: string;
    userId: string;
    questionId: string;
    token: string;
  },
import { Socket } from 'socket.io';
import { executeCode } from './code-execution-service';
import {
  JoinCollabData,
  CodeUpdateData,
  MessageData,
  LeaveCollabData,
  RunCodeData,
  ChangeLanguageData,
  AttemptData,
} from '../models/models';
import { StateManager } from './stateManager';
import { RedisService } from './redisService';
import { sendAttemptData } from './attemptService';

const redisService = new RedisService();
const stateManager = new StateManager();

export async function joinCollaborationRoom(
  socket: Socket,
  data: JoinCollabData,
  callback: (response: { success: boolean }) => void
) {
  const { roomId, userName, userId, questionId, token } = data;
  socket.join(roomId);
  console.log(`User ${userName} joined room ${roomId}`);

  // Add user to state manager
  stateManager.addUserToRoom(socket.id, roomId, { userName, userId, questionId, token });

  console.log(`Current users in room ${roomId}:`, stateManager.getCurrentUsersInRoom(roomId));

  const existingCode = await redisService.getCode(roomId);
  const existingOutput = await redisService.getOutput(roomId);
  const existingLanguage = await redisService.getLanguage(roomId);

  socket.emit("code_update", { code: existingCode });

  if (existingOutput) {
    socket.emit("code_result", { output: existingOutput });
  }

  if (existingLanguage) {
    socket.emit("change_language", { newLanguage: existingLanguage });
  }

  callback({ success: true });
}

export async function handleCodeUpdates(socket: Socket, data: CodeUpdateData) {
  const { roomId, code } = data;
  await redisService.setCode(roomId, code);
  socket.to(roomId).emit("code_update", { code });
}

export async function handleSendMessage(socket: Socket, data: MessageData) {
  const { roomId, userName, message } = data;
  const chatMessage = { userName, message, timestamp: Date.now() };
  console.log(`User ${userName} sent a message in room ${roomId}`);
  await redisService.pushChatMessage(roomId, JSON.stringify(chatMessage));
  socket.to(roomId).emit('receive_message', chatMessage);
}


export async function handleLeaveRoom(socket: Socket, data: LeaveCollabData) {
  const { roomId, codeContent } = data;
  socket.leave(roomId);

  // Get userInfo before removing from state
  const userInfo = stateManager.getUserInfo(socket.id);
  if (!userInfo) {
    console.log(`No user info found for socket ID: ${socket.id}`);
    return;
  }
  const { userName, userId, questionId, token } = userInfo;
  console.log(
    `User ${userName} left room ${roomId} with final code content:`,
    codeContent
  );

  // Calculate time taken based on room start time
  const endTime = Date.now();
  const roomStartTime = stateManager.getRoomStartTime(roomId);
  let timeTaken: number;

  if (roomStartTime) {
    timeTaken = Math.floor((endTime - roomStartTime) / 1000);
  } else {
    timeTaken = 0;
  }

  // Check if timeTaken is already stored for the room
  let roomTimeTaken = stateManager.getRoomTimeTaken(roomId);
  if (!roomTimeTaken) {
    // First user to leave; store timeTaken
    stateManager.setRoomTimeTaken(roomId, timeTaken);
    roomTimeTaken = timeTaken;
  } else {
    // Use existing timeTaken
    timeTaken = roomTimeTaken;
  }

  // Fetch the current code content and language from Redis
  const currentCode = await redisService.getCode(roomId);
  const currentLanguage = await redisService.getLanguage(roomId);

  const peerUserNames = stateManager.getPeerUserNames(roomId, userName);
  const peerUserName = peerUserNames.length > 0 ? peerUserNames[0] : undefined;

  console.log(`Peer userName is: ${peerUserName}`);

  // Send attempt data to question-service
  const attemptData: AttemptData = {
    userId,
    questionId,
    peerUserName,
    timeTaken,
    codeContent: currentCode,
    language: currentLanguage,
  };

  try {
    await sendAttemptData(attemptData, token);
    // Emit "attempt_saved" event to the room to notify clients
    socket.to(roomId).emit("attempt_saved");
  } catch (error: any) {
      console.error(
      `Error sending attempt data to question-service:`,
      error.message
    );
  }

  // Notify the remaining user
  if (peerUserName) {
    socket.to(roomId).emit("peer_left", { userName });
  }

  socket.to(roomId).emit("leave_collab_notify", { userName });

  // Now remove user from room and state
  stateManager.removeUserFromRoom(socket.id, roomId);
}

interface TestTemplateCode {
  python: string;
  java: string;
  javascript: string;
}

export async function handleRunCode(
  socket: Socket,
  {
    roomId,
    code,
    language,
    testCases,
    testTemplateCode,
  }: {
    roomId: string;
    code: string;
    language: string;
    testCases: Array<{ input: any[]; output: any[] }> | null;
    testTemplateCode: TestTemplateCode | null;
  }
) {
  socket.to(roomId).emit("code_execution_started");
  socket.emit("code_execution_started");

  try {
    let output;

    if (!testCases || !testTemplateCode) {
      output = await executeCode(code, language);
    } else {
      output = await executeCodeWithTestCases(
        code,
        language,
        testCases,
        testTemplateCode
      );
    }

    await redis.set(`collab:${roomId}:output`, output, "EX", 3600);

    socket.to(roomId).emit("code_result", { output });
    socket.emit("code_result", { output });
  } catch (error) {
    console.error("Error executing code:", error);
    const errorMessage = "Error executing code.";
    socket.to(roomId).emit("code_result", { output: errorMessage });
    socket.emit("code_result", { output: errorMessage });
  } finally {
    socket.to(roomId).emit("code_execution_finished");
    socket.emit("code_execution_finished");
  }
}

export async function changeLanguage(
  socket: Socket,
  { roomId, newLanguage }: { roomId: string; newLanguage: string }
) {
  await redis.set(`collab:${roomId}:language`, newLanguage, "EX", 3600);
  socket.to(roomId).emit("change_language", { newLanguage });
}
