import { fork } from 'child_process';
import path from 'path';

import type { Server } from 'socket.io';

import { logger } from '@/lib/utils';
import { MATCH_SVC_EVENT, type IChildProcessMessage } from '@/ws';

export const initWorker = (name: string, io: Server) => {
  const controller = new AbortController();
  const lCaseName = name.toLowerCase();
  const worker = fork(path.join(__dirname, `${lCaseName}.js`), { signal: controller.signal });
  const upperCaseName = name.replace(/^[A-Za-z]/, (c) => c.toUpperCase());
  worker.on('message', (message) => {
    if (typeof message.valueOf() === 'string') {
      logger.info(`[${upperCaseName}]: ${message}`);
      return;
    }
    const messagePayload = message.valueOf();
    logger.info(`[${upperCaseName}] WS Payload: ${JSON.stringify(messagePayload)}`);
    const { rooms, event, message: payload } = messagePayload as IChildProcessMessage;
    if (event === MATCH_SVC_EVENT.DISCONNECT) {
      io.sockets.in(rooms).disconnectSockets();
      return;
    }
    io.sockets.in(rooms).emit(event, payload);
  });
  worker.on('exit', (code) => {
    logger.error(`${upperCaseName} exited with code ${code}.`);
  });
  return { worker, controller };
};
