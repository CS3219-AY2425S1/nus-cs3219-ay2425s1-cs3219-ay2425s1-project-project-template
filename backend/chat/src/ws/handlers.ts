import type { DefaultEventsMap, Server, Socket } from 'socket.io';

import { db } from '@/lib/db';
import { chatMessages } from '@/lib/db/schema';
import { logger } from '@/lib/utils';
import type { IChatMessage } from '@/types';

type ISocketIOServer<T> = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, T>;
type ISocketIOSocket<T> = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, T>;

export const joinRoomHandler =
  <T>(socket: ISocketIOSocket<T>) =>
  (roomId?: string) => {
    if (!roomId) {
      logger.warn('joinRoom event received without a roomId');
      return;
    }

    socket.join(roomId);
    logger.info(`Socket ${socket.id} joined room: ${roomId}`);
    socket.emit('joinedRoom', roomId); // Notify client that they joined the room
  };

export const leaveRoomHandler =
  <T>(socket: ISocketIOSocket<T>) =>
  (roomId?: string) => {
    if (roomId) {
      socket.leave(roomId);
      logger.info(`Socket ${socket.id} left room: ${roomId}`);
      socket.emit('leftRoom', roomId); // Notify client that they left the room
    } else {
      logger.warn('leaveRoom event received without a roomId');
    }
  };

export const sendMessageHandler =
  <T>(io: ISocketIOServer<T>, socket: ISocketIOSocket<T>) =>
  async (payload: Partial<IChatMessage>) => {
    const { roomId, senderId, message } = payload;

    if (!roomId || !senderId || !message) {
      const errorMessage = 'sendMessage event received with incomplete data';
      logger.warn(errorMessage);
      socket.emit('error', errorMessage);
      return;
    }

    try {
      await db.insert(chatMessages).values({
        roomId,
        senderId,
        message,
        createdAt: new Date(),
      });

      const messageData = {
        roomId,
        senderId,
        message,
        createdAt: new Date().toISOString(),
      };
      io.to(roomId).emit('newMessage', messageData);
      logger.info(`Message from ${senderId} in room ${roomId}: ${message}`);
    } catch (error) {
      logger.error('Failed to save message:', error);
      socket.emit('error', 'Failed to send message');
    }
  };
