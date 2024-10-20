import WebSocket from "ws";
import http from "http";
import { CustomWebSocket } from "../model/CustomWebSocket";
import redisClient from "../config/redisConfig";
import { removeUserFromKey } from "../model/userModel";

class WebSocketService {
  private wss: WebSocket.Server;
  private clients: Map<string, CustomWebSocket> = new Map();
  private pendingNotifications: Map<string, any> = new Map();

  constructor(server: http.Server) {
    this.wss = new WebSocket.Server({ server });
    this.init();
  }

  private init() {
    this.wss.on("connection", (ws: CustomWebSocket) => {
      console.log("New WebSocket connection established");

      ws.on("message", (message: WebSocket.Data) => {
        try {
          const data = JSON.parse(message.toString());
          if (data.type === "register" && typeof data.userId === "string") {
            ws.userId = data.userId;
            this.clients.set(data.userId, ws);
            console.log(`User ${data.userId} registered for match updates`);
            this.sendPendingNotification(data.userId, ws);
          } else if (
            data.type === "cancel" &&
            typeof data.userId === "string"
          ) {
            this.handleCancelRequest(data.userId);
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      });

      ws.on("close", () => {
        if (ws.userId) {
          console.log(`WebSocket connection closed for user: ${ws.userId}`);
          this.clients.delete(ws.userId);
        } else {
          console.log("WebSocket connection closed for unregistered user");
        }
      });
    });
  }

  private sendPendingNotification(userId: string, ws: CustomWebSocket) {
    const pendingNotification = this.pendingNotifications.get(userId);
    if (pendingNotification) {
      console.log(`Sending pending notification to user: ${userId}`);
      ws.send(
        JSON.stringify({
          type: "match",
          data: pendingNotification,
        }),
      );
      this.pendingNotifications.delete(userId);
    }
  }

  public async notifyMatch(user1Id: string, user2Id: string, matchData: any) {
    console.log(`Attempting to notify users: ${user1Id} and ${user2Id}`);

    const notifyUser = async (userId: string) => {
      const client = this.clients.get(userId);
      if (client) {
        console.log(`Sending match notification to user: ${userId}`);
        client.send(
          JSON.stringify({
            type: "match",
            data: matchData,
          }),
        );
        this.pendingNotifications.delete(userId);
      } else {
        console.log(`User ${userId} not connected, queueing notification`);
        this.pendingNotifications.set(userId, matchData);

        for (let i = 0; i < 10; i++) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const client = this.clients.get(userId);
          if (client) {
            console.log(
              `Sending delayed match notification to user: ${userId}`,
            );
            client.send(
              JSON.stringify({
                type: "match",
                data: matchData,
              }),
            );
            this.pendingNotifications.delete(userId);
            break;
          }
        }
        if (!this.clients.get(userId)) {
          console.log(
            `Failed to send notification to user: ${userId} after multiple attempts`,
          );
        }
      }
    };

    await notifyUser(user1Id);
    await notifyUser(user2Id);
  }

  private handleCancelRequest(userId: string) {
    console.log(`Cancellation request received for user: ${userId}`);
    // Remove the user from the clients map
    this.clients.delete(userId);
    // Remove any pending notifications for this user
    this.pendingNotifications.delete(userId);
    // TODO: Implement logic to remove the user from Redis queues
    this.removeUserFromQueues(userId);
  }

  private async removeUserFromQueues(userId: string) {
    // This method should remove the user from all Redis queues
    // You'll need to implement this logic based on your Redis structure
    // For example:
    const allTopics = await redisClient.keys("topic:*");
    const allDifficulties = await redisClient.keys("difficulty:*");

    const removeFromQueue = async (key: string) => {
      const users = await redisClient.zRange(key, 0, -1);
      for (const userString of users) {
        const user = JSON.parse(userString);
        if (user._id === userId) {
          await removeUserFromKey(key, userString);
          console.log(`Removed user ${userId} from queue ${key}`);
          break;
        }
      }
    };

    for (const key of [...allTopics, ...allDifficulties]) {
      await removeFromQueue(key);
    }
  }
}

export default WebSocketService;
