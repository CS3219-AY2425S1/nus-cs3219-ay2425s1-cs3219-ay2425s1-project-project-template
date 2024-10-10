import { EventEmitter } from "events";
import { MatchRequest, UserMatch, QueuedUser } from "../utils/types";
import { config } from "../utils/config";
import logger from "../utils/logger";
import Deque from "denque";

export class MatchController extends EventEmitter {
  private waitingUsers: Map<string, Deque<QueuedUser>>;
  private matchTimeouts: Map<string, NodeJS.Timeout>;

  constructor() {
    super();
    this.waitingUsers = new Map([
      ["EASY", new Deque<QueuedUser>()],
      ["MEDIUM", new Deque<QueuedUser>()],
      ["HARD", new Deque<QueuedUser>()],
    ]);
    this.matchTimeouts = new Map();
  }

  addToMatchingPool(userId: string, request: MatchRequest): void {
    const { difficultyLevel } = request;

    // Add user to the appropriate difficulty queue
    const queue = this.waitingUsers.get(difficultyLevel);
    const queuedUser: QueuedUser = { ...request, userId }; // Include userId in the request

    queue?.push(queuedUser);
    logger.info(
      `User ${userId} added to ${difficultyLevel} queue. Queue size: ${queue?.size()}`
    );

    const timeout = setTimeout(() => {
      this.removeFromMatchingPool(userId, request);
      this.emit("match-timeout", userId);
      logger.info(`Match timeout for user ${userId}`);
    }, config.matchTimeout);

    this.matchTimeouts.set(userId, timeout);

    this.tryMatch(userId, request);
  }

  removeFromMatchingPool(userId: string, request: MatchRequest): void {
    const { difficultyLevel } = request;

    const queue = this.waitingUsers.get(difficultyLevel);
    if (queue) {
      const updatedQueue = new Deque(
        queue.toArray().filter((user) => user.userId !== userId)
      );
      this.waitingUsers.set(difficultyLevel, updatedQueue);
      logger.info(
        `User ${userId} removed from ${difficultyLevel} queue. Queue size: ${updatedQueue.size()}`
      );
    }

    const timeout = this.matchTimeouts.get(userId);
    if (timeout) {
      clearTimeout(timeout);
      this.matchTimeouts.delete(userId);
    }
  }

  private tryMatch(userId: string, request: MatchRequest): void {
    const { difficultyLevel, category } = request;
    const queue = this.waitingUsers.get(difficultyLevel);

    if (!queue || queue.isEmpty()) {
      logger.info(
        `Queue is empty or no match for ${userId} in ${difficultyLevel} queue`
      );
      return;
    }

    logger.info(
      `Attempting match for user ${userId} in ${difficultyLevel} queue with queue size: ${queue.size()}`
    );

    // Try to find a compatible match in the queue
    for (let i = 0; i < queue.size(); i++) {
      const potentialMatch = queue.peekAt(i); // Peek at user

      if (!potentialMatch) continue;

      const { userId: potentialMatchId } = potentialMatch;

      if (potentialMatchId === userId) continue;

      if (this.isCompatibleMatch(request, potentialMatch)) {
        const match: UserMatch = {
          difficultyLevel,
          category: category || potentialMatch.category || null,
        };

        this.removeFromMatchingPool(userId, request);
        this.removeFromMatchingPool(potentialMatchId, potentialMatch);

        this.emit("match-success", {
          user1Id: userId,
          user2Id: potentialMatch.userId,
          match,
        });

        logger.info(
          `Match success: User ${userId} matched with ${potentialMatchId} in ${difficultyLevel} queue`
        );

        return;
      }
    }

    logger.info(
      `No match found for user ${userId} in ${difficultyLevel} queue`
    );
  }

  private isCompatibleMatch(
    request1: MatchRequest,
    request2: MatchRequest
  ): boolean {
    // Match if categories are the same or if either user has no category
    return (
      request1.category === request2.category ||
      !request1.category ||
      !request2.category
    );
  }
}
