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
  console.log(`User ${userName} left room ${roomId} with final code content:`, codeContent);

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

export async function handleRunCode(socket: Socket, data: RunCodeData) {
  const { roomId, code, language } = data;
  socket.to(roomId).emit('code_execution_started');
  socket.emit('code_execution_started');

  try {
    const output = await executeCode(code, language);
    await redisService.setOutput(roomId, output);

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

export async function changeLanguage(socket: Socket, data: ChangeLanguageData) {
  const { roomId, newLanguage } = data;
  await redisService.setLanguage(roomId, newLanguage);
  socket.to(roomId).emit('change_language', { newLanguage });
}
