import { createServer } from 'http';

import { Server } from 'socket.io';

import { UI_HOST } from '@/config';
import { logger } from '@/lib/utils';

import { cancelRoomHandler, EVENTS, joinRoomHandler, queueEventHandler } from './handlers';

export const createWs = (server: ReturnType<typeof createServer>) => {
  const io = new Server(server, {
    cors: {
      origin: [UI_HOST],
      credentials: true,
    },
    path: '/matching-socket',
  });
  io.on('connection', (socket) => {
    logger.info(`Socket ${socket.id} connected`);

    socket.on(EVENTS.JOIN_ROOM, joinRoomHandler(socket));
    socket.on(EVENTS.CANCEL_ROOM, cancelRoomHandler(io, socket));
    socket.on(EVENTS.LEAVE_ROOM, (room) => {
      socket.leave(room);
    });
    socket.on(EVENTS.DISCONNECT, () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
    socket.on(EVENTS.START_QUEUE, queueEventHandler(socket));
  });
  return io;
};

export const MATCH_SVC_EVENT = {
  QUEUED: 'QUEUED', // When match joins pool
  SUCCESS: 'SUCCESS', // When match successful
  FAILED: 'FAILED', // When match failed
  PENDING: 'PENDING', // When waiting for match
  MATCHING: 'MATCHING', // When matching in progress
  DISCONNECT: 'DISCONNECT', // To disconnect all sockets in room
} as const;
export type IMatchEvent = (typeof MATCH_SVC_EVENT)[keyof typeof MATCH_SVC_EVENT];
export type IChildProcessMessage = {
  rooms: Array<string>;
  event: IMatchEvent;
  message?: unknown;
};
