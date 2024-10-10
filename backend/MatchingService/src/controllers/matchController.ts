import { EventEmitter } from "events";
import { MatchRequest, UserMatch } from "../utils/types";
import { config } from "../utils/config";
import logger from "../utils/logger";

export class MatchController extends EventEmitter {
  private waitingUsers: Map<
    string,
    { userId: string; request: MatchRequest }[]
  >;
  private matchTimeouts: Map<string, NodeJS.Timeout>;

  constructor() {
    super();
    this.waitingUsers = new Map();
    this.matchTimeouts = new Map();
  }

  addToMatchingPool(userId: string, request: MatchRequest): void {
    // A queue for storing user(s) of same difficulty-cateogory
    const key = `${request.difficultyLevel}-${request.category}`;
    const queue = this.waitingUsers.get(key) || [];

    queue.push({ userId, request });

    this.waitingUsers.set(key, queue);

    const timeout = setTimeout(() => {
      this.removeFromMatchingPool(userId, request);
      this.emit("match-timeout", userId);
      logger.info(`Match timeout for user ${userId}`);
    }, config.matchTimeout);

    this.matchTimeouts.set(userId, timeout);

    this.tryMatch(userId, request);
  }

  removeFromMatchingPool(userId: string, request: MatchRequest): void {
    const key = `${request.difficultyLevel}-${request.category}`;
    const queue = this.waitingUsers.get(key);

    if (queue) {
      const updatedQueue = queue.filter((user) => user.userId !== userId);

      if (updatedQueue.length > 0) {
        this.waitingUsers.set(key, updatedQueue);
      } else {
        this.waitingUsers.delete(key);
      }
    }

    const timeout = this.matchTimeouts.get(userId);
    if (timeout) {
      clearTimeout(timeout);
      this.matchTimeouts.delete(userId);
    }
  }

  private tryMatch(userId: string, request: MatchRequest): void {
    const key = `${request.difficultyLevel}-${request.category}`;
    const queue = this.waitingUsers.get(key);

    if (!queue) return;

    if (queue && queue.length > 1) {
      // Check if there’s at least one matchable user
      const potentialMatch = queue.find((user) => user.userId !== userId);

      if (potentialMatch) {
        const match: UserMatch = {
          difficultyLevel: request.difficultyLevel,
          category: request.category,
        };

        this.removeFromMatchingPool(userId, request);
        this.removeFromMatchingPool(
          potentialMatch.userId,
          potentialMatch.request
        );

        this.emit("match-success", {
          user1Id: userId,
          user2Id: potentialMatch.userId,
          match,
        });

        logger.info(`Match found between ${userId} and ${potentialMatch}`, {
          match,
        });
        return;
      }
    }
  }
}
