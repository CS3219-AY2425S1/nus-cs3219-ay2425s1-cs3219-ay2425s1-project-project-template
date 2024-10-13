import { Queue, IQueue } from "../services/queue";

const queue: IQueue = new Queue();

enum MatchingEvent {
  REQUEST_MATCH = "requestMatch",
  CANCEL_MATCH_REQUEST = "cancelMatchRequest",
}

export function evaluate(event: MatchingEvent, message: any): any {
  switch (event) {
    case MatchingEvent.REQUEST_MATCH:
      return queue.add({
        id: message.connectionId,
        userId: message.username,
        topic: message.topic,
        difficulty: message.difficulty,
      });
    case MatchingEvent.CANCEL_MATCH_REQUEST:
      return queue.cancel(message.connectionId);
    default:
      return { error: "Invalid event" };
  }
}
