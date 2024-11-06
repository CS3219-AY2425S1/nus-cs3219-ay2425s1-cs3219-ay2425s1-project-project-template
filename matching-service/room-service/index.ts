import express from "express";
import { Kafka } from "kafkajs";
import cors from "cors";

const app = express();

const kafka = new Kafka({ brokers: ["kafka:9092"], retry: { retries: 5 } });
const kafkaConsumer = kafka.consumer({ groupId: "room-service" });

app.use(express.json());
app.use(cors());

// helper function to create room from collaboration service
const createRoom = async (userA: string, userB: string, topic: string): Promise<void> => {
  try {
    const response = await fetch(
      "http://collaboration-service:5001/room/createRoom",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId1: userA,
          userId2: userB,
          topic: topic,
        }),
      }
    );
    if (response.status === 201) {
      const data = await response.json();
      const roomId = data.roomId;
      console.log(
        `Room ID ${roomId} created successfully for users ${userA} and ${userB}.`
      );
      return roomId;
    } else {
      const errorMsg = await response.text();
      console.error(
        `Failed to create room. Status ${response.status}, Response: ${errorMsg}`
      );
    }
  } catch (error: any) {
    console.error(`Error creating room for users ${userA} and ${userB}`);
    console.error(error);
  }
};

(async () => {
  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe({
    topic: "match-found-events",
    fromBeginning: false,
  });

  await kafkaConsumer.run({
    eachMessage: async ({ message }) => {
      if (message.value) {
        try {
          const matchFoundEvent = JSON.parse(message.value.toString());
          const { userA, userB, topic } = matchFoundEvent;

          console.log(
            `Received match-found-event between User A: ${userA} and User B: ${userB}`
          );

          // calling the helper function
          await createRoom(userA, userB, topic);
        } catch (error: any) {
          console.error("Error processing match-found-event:", error.message);
        }
      }
    },
  });
})();

app.listen(3005, () => {
  console.log("Server started on port 3005");
});
