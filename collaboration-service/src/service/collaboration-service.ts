import { Socket } from "socket.io";
import Redis from "ioredis";
import { executeCode } from "./code-execution-service";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const redis = new Redis(REDIS_URL);

export async function joinCollaborationRoom(socket: Socket, { roomId, userName }: { roomId: string; userName: string }, callback: (response: { success: boolean }) => void) {
  socket.join(roomId);
  console.log(`User ${userName} joined room ${roomId}`);

  const existingCode = await redis.get(`collab:${roomId}:code`) || "";

  const existingOutput = await redis.get(`collab:${roomId}:output`);
  socket.emit("code_update", { code: existingCode });

  if (existingOutput) {
    socket.emit("code_result", { output: existingOutput });
  }

  callback({ success: true });
}

export async function handleCodeUpdates(socket: Socket, { roomId, code }: { roomId: string; code: string }) {
  await redis.set(`collab:${roomId}:code`, code, "EX", 3600);
  socket.to(roomId).emit("code_update", { code });
}

export async function handleLeaveRoom(socket: Socket, { roomId, userName }: { roomId: string; userName: string }) {
  socket.leave(roomId);
  console.log(`User ${userName} left room ${roomId}`);

  socket.to(roomId).emit("leave_collab_notify", { userName });
}

export async function handleRunCode(socket: Socket, { roomId, code }: { roomId: string; code: string }) {
  socket.to(roomId).emit("code_execution_started");
  socket.emit("code_execution_started");

  try {
    const output = await executeCode(code);

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
