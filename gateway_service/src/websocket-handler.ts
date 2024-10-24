// api-gateway/websocket-handler.ts
import { Server, Socket } from "socket.io";
import { Kafka } from "kafkajs";
import { ClientSocketEvents } from "peerprep-shared-types";

export class WebSocketHandler {
  private io: Server;
  private kafka: Kafka;
  private producer: any;
  private consumer: any;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: `*`,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // this.kafka = new Kafka({
    //   clientId: "api-gateway",
    //   brokers: ["localhost:9092"],
    //   retry: {
    //     initialRetryTime: 100,
    //     retries: 8,
    //   },
    // });
    this.kafka = new Kafka({
      clientId: "api-gateway",
      brokers: [`kafka-service:${process.env.KAFKA_BROKER_PORT}`],
    });

    this.setupKafka();
    this.setupSocketHandlers();
  }

  private async setupKafka() {
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "api-gateway-group" });

    await this.producer.connect();
    await this.consumer.connect();

    // Subscribe to gateway events from Collaboration Service
    await this.consumer.subscribe({ topic: "gateway-events" });

    // Handle events from Collaboration Service
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: any) => {
        const event = JSON.parse(message.value.toString());
        this.handleCollaborationEvent(event);
      },
    });
  }

  private setupSocketHandlers() {
    this.io.on("connection", (socket: Socket) => {
      console.log("Client connected:", socket.id);

      socket.on("requestMatch", async (data) => {
        await this.producer.send({
          topic: "collaboration-events",
          messages: [
            {
              key: socket.id,
              value: JSON.stringify({
                type: "MATCH_REQUEST",
                socketId: socket.id,
                ...data,
              }),
            },
          ],
        });
      });

      socket.on(ClientSocketEvents.JOIN_ROOM, async (data) => {
        console.log("Joining room:", data.roomId);
        socket.join(data.roomId);
        await this.producer.send({
          topic: "collaboration-events",
          messages: [
            {
              key: data.roomId,
              value: JSON.stringify({
                type: "JOIN_ROOM",
                socketId: socket.id,
                ...data,
              }),
            },
          ],
        });
      });

      socket.on("codeChange", async (data) => {
        console.log("Code change:", data);
        await this.producer.send({
          topic: "collaboration-events",
          messages: [
            {
              key: data.roomId,
              value: JSON.stringify({
                type: "CODE_CHANGE",
                socketId: socket.id,
                ...data,
              }),
            },
          ],
        });
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  private handleCollaborationEvent(event: any) {
    switch (event.type) {
      case "MATCH_FOUND":
        console.log("Match found:", event.participants);
        this.io.to(event.socketId).emit("matchFound", {
          roomId: event.roomId,
          participants: event.participants,
        });
        break;

      case "CODE_CHANGED":
        console.log("Code changed:", event.change);
        this.io.to(event.roomId).emit("codeChanged", {
          change: event.change,
          userId: event.userId,
        });
        break;

      case "ROOM_UPDATED":
        this.io.to(event.roomId).emit("roomUpdated", event.room);
        break;
    }
  }
}
