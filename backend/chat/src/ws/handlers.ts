import type { DefaultEventsMap, Server, Socket } from 'socket.io';

import { db } from '@/lib/db';
import { chatMessages } from '@/lib/db/schema';
import { logger } from '@/lib/utils';
import type { IChatMessage } from '@/types';

import { WS_CLIENT_EVENT, WS_SERVER_EVENT } from './events';

type ISocketIOServer<T> = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, T>;
type ISocketIOSocket<T> = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, T>;

export const joinRoomHandler =
  <T>(socket: ISocketIOSocket<T>) =>
  (roomId?: string) => {
    if (!roomId) {
      logger.warn(`${WS_CLIENT_EVENT.JOIN_ROOM} event received without a roomId`);
      return;
    }

    socket.join(roomId);
    logger.info(`Socket ${socket.id} joined room: ${roomId}`);
    socket.emit(WS_SERVER_EVENT.JOINED_ROOM, roomId); // Notify client that they joined the room
  };

export const leaveRoomHandler =
  <T>(socket: ISocketIOSocket<T>) =>
  (roomId?: string) => {
    if (roomId) {
      socket.leave(roomId);
      logger.info(`Socket ${socket.id} left room: ${roomId}`);
      socket.emit(WS_SERVER_EVENT.LEFT_ROOM, roomId); // Notify client that they left the room
    } else {
      logger.warn(`${WS_CLIENT_EVENT.LEAVE_ROOM} event received without a roomId`);
    }
  };

export const sendMessageHandler =
  <T>(io: ISocketIOServer<T>, socket: ISocketIOSocket<T>) =>
  async (payload: Partial<IChatMessage>) => {
    const { roomId, senderId, message } = payload;

    if (!roomId || !senderId || !message) {
      const errorMessage = `${WS_CLIENT_EVENT.SEND_MESSAGE} event received with incomplete data`;
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
      io.to(roomId).emit(WS_SERVER_EVENT.NEW_MESSAGE, messageData);
      logger.info(`Message from ${senderId} in room ${roomId}: ${message}`);
    } catch (error) {
      logger.error('Failed to save message:', error);
      socket.emit('error', 'Failed to send message');
    }
  };
