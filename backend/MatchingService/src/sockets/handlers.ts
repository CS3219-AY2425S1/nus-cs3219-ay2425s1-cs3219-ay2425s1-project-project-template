import { Server, Socket } from "socket.io";
import { MatchController } from "../controllers/matchController";
import { MatchRequest } from "../utils/types";
import { validateMatchRequest } from "../utils/validation";
import logger from "../utils/logger";

export const initializeSocketHandlers = (io: Server): void => {
  const matchController = new MatchController();

  const handleMatchRequest = (socket: Socket, request: MatchRequest) => {
    try {
      validateMatchRequest(request);
      socket.emit("match-request-accepted");
      logger.info(`Match requested for user ${socket.id}`, { request });
      matchController.addToMatchingPool(socket.id, request);
    } catch (error) {
      socket.emit("match-request-error", {
        message:
          error instanceof Error ? error.message : "Invalid match request",
      });
    }
  };

  const handleCancelMatch = (socket: Socket) => {
    const matchRequest: MatchRequest | undefined = socket.data.matchRequest;
    if (matchRequest) {
      matchController.removeFromMatchingPool(socket.id, matchRequest);
      socket.emit("match-cancelled");
      logger.info(`Match cancelled for user ${socket.id}`);
    } else {
      logger.warn(
        `No match request found for user ${socket.id} when attempting to cancel match.`
      );
    }
  };

  const handleDisconnect = (socket: Socket) => {
    const matchRequest: MatchRequest | undefined = socket.data.matchRequest;
    if (matchRequest) {
      matchController.removeFromMatchingPool(socket.id, matchRequest);
      logger.info(`User disconnected: ${socket.id}`);
    } else {
      logger.warn(
        `No match request found for user ${socket.id} on disconnect.`
      );
    }
  };

  io.on("connection", (socket: Socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.on("request-match", (request: MatchRequest) =>
      handleMatchRequest(socket, request)
    );

    socket.on("cancel-match", () => handleCancelMatch(socket));

    socket.on("disconnect", () => handleDisconnect(socket));
  });

  matchController.on("match-success", ({ user1Id, user2Id, match }) => {
    io.to(user1Id).to(user2Id).emit("match-found", match);
  });

  matchController.on("match-timeout", (userId) => {
    io.to(userId).emit("match-timeout");
  });
};
