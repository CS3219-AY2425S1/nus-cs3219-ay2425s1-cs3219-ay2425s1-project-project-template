import { IPoolTicket, IStreamMessage } from '@/types';

export const decodePoolTicket = (ticket: IStreamMessage) => {
  const { userId, socketPort, topic, difficulty, timestamp } = ticket.message as IPoolTicket;
  return {
    id: ticket.id,
    userId,
    socketPort,
    timestamp,
    topic,
    difficulty,
  };
};
