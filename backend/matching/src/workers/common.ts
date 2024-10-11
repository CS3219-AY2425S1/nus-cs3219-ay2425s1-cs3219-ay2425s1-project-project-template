import type { IChildProcessMessage, IMatchEvent } from '@/ws';

export const sendNotif = (roomIds: Array<string>, event: IMatchEvent, message?: unknown) => {
  if (process.send) {
    const payload: IChildProcessMessage = {
      rooms: roomIds,
      event,
      message,
    };
    process.send(payload);
  }
};
