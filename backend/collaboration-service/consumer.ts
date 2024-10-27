import * as amqp from "amqplib/callback_api";
import { MatchModel, Question } from "./models/match"; // Use MatchModel instead of Match
import axios from "axios";
import { Server } from "socket.io";

export function startRabbitMQ(io: Server) {
  const rabbitMQUrl = process.env.RABBITMQ_URL || "amqp://localhost";
  const questionsAPIUrl = `${process.env.QUESTIONS_API_URL}/questions`;

  amqp.connect(rabbitMQUrl, (error0, connection) => {
    if (error0) {
      console.error("Failed to connect to RabbitMQ:", error0);
      return;
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        console.error("Failed to open a channel:", error1);
        return;
      }
      const queue = "match_queue";
      channel.assertQueue(queue, { durable: false });
      console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

      channel.consume(
        queue,
        async (msg) => {
          if (!msg) return;

          const matchResult = JSON.parse(msg.content.toString());
          console.log(`Received message: ${JSON.stringify(matchResult)}`);

          // Build match info based on received message
          const matchInfo = {
            userOne: matchResult.userOne,
            userTwo: matchResult.userTwo,
            room_id: matchResult.roomId,
            complexity: matchResult.difficulty_level,
            categories: matchResult.categories,
            question: {} as Question,
          };

          try {
            // Fetch a question matching the specified categories and complexity
            const question = await fetchQuestion(
              matchInfo.categories,
              matchInfo.complexity,
              questionsAPIUrl
            );

            matchInfo.question = question;

            // Save the match information to MongoDB
            const newMatch = new MatchModel(matchInfo); // Use MatchModel to create the document
            await newMatch.save();
            console.log(`Match saved to MongoDB: ${JSON.stringify(newMatch)}`);
          } catch (error) {
            console.error("Error processing message:", error);
          }
        },
        { noAck: true }
      );
    });
  });
}

// Fetch a single question based on categories and complexity
async function fetchQuestion(
  categories: string[],
  complexities: string[],
  apiURL: string
): Promise<Question> {
  try {
    const response = await axios.get(apiURL, {
      params: {
        categories,
        complexities,
      },
      headers: {
        Cookie: `serverToken=${process.env.SERVER_SECRET};`,
      },
    });

    const questions = response.data.data;
    if (questions.length === 0) throw new Error("No matching questions found");
    return questions[0];
  } catch (error) {
    console.error("Failed to fetch question:", error);
    throw error;
  }
}

