import { EventEmitter } from "events";
import { MatchRequest, UserMatch, QueuedUser } from "../utils/types";
import { config } from "../utils/config";
import logger from "../utils/logger";

export class MatchController extends EventEmitter {
  private waitingUsers: Map<string, QueuedUser[]>;
  private matchTimeouts: Map<string, NodeJS.Timeout>;

  constructor() {
    super();
    this.waitingUsers = new Map([
      ["easy", []],
      ["medium", []],
      ["hard", []],
    ]);
    this.matchTimeouts = new Map();
  }

  addToMatchingPool(userId: string, request: MatchRequest): void {
    const { difficultyLevel } = request;

    // Add user to the appropriate difficulty queue
    const queue = this.waitingUsers.get(difficultyLevel) || [];
    const queuedUser: QueuedUser = { ...request, userId }; // Include userId in the request

    queue.push(queuedUser);
    this.waitingUsers.set(difficultyLevel, queue);

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
      const updatedQueue = queue.filter((user) => user.userId !== userId);
      this.waitingUsers.set(difficultyLevel, updatedQueue);
    }

    const timeout = this.matchTimeouts.get(userId);
    if (timeout) {
      clearTimeout(timeout);
      this.matchTimeouts.delete(userId);
    }
  }

  private tryMatch(userId: string, request: MatchRequest): void {
    const { difficultyLevel, category } = request;
    const queue = this.waitingUsers.get(difficultyLevel) || [];

    if (!queue) return;

    // Try to find a compatible match in the queue
    for (const potentialMatch of queue) {
      const {
        userId: potentialMatchId,
        difficultyLevel: potentialMatchDifficulty,
        category: potentialMatchCategory,
      } = potentialMatch;

      if (potentialMatchId === userId) continue;

      // Check if the categories match or one of the users has no category
      if (this.isCompatibleMatch(request, potentialMatch)) {
        // Match found
        const match: UserMatch = {
          difficultyLevel,
          category: category || potentialMatch.category || null, // Handle optional category
        };

        this.removeFromMatchingPool(userId, request);
        this.removeFromMatchingPool(potentialMatchId, potentialMatch);

        this.emit("match-success", {
          user1Id: userId,
          user2Id: potentialMatch.userId,
          match,
        });
        return;
      }
    }
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
