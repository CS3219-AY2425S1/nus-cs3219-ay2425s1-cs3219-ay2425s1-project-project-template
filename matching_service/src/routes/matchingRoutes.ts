import express, { Request, Response } from "express";
import { Queue, IQueue } from "../services/queue";

const router = express.Router();

const queue: IQueue = new Queue();

enum MatchingEvent {
  REQUEST_MATCH = "requestMatch",
  CANCEL_MATCH_REQUEST = "cancelMatchRequest",
}

export function evaluate(event: MatchingEvent, message: any): any {
  switch (event) {
    case MatchingEvent.REQUEST_MATCH:
      return queue.add({
        username: message.username,
        topic: message.topic,
        difficulty: message.difficulty,
        timestamp: Date.now(),
      });
    case MatchingEvent.CANCEL_MATCH_REQUEST:
      return queue.cancel(message.connectionId);
    default:
      return { error: "Invalid event" };
  }
}

router.post("/match", async (req, res) => {
  try {
    const body = req.body;
    const message = {
      id: body.connectionId,
      userId: body.username,
      topic: body.topic,
      difficulty: body.difficulty,
    };

    const { success } = evaluate(MatchingEvent.REQUEST_MATCH, message);

    if (success) {
      res.status(200).json({ message: "Added to queue, finding match" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error finding match", error });
  }
});

router.post("/cancel", async (req, res) => {
  try {
    const { success } = evaluate(
      MatchingEvent.CANCEL_MATCH_REQUEST,
      req.body.connectionId
    );

    if (success) {
      res.status(200).json({ message: "Successfully cancelled match" });
    }
  } catch (error) {
    res.status(500).json({ message: "Unable to cancel match", error });
  }
});

export default router;
