import express from 'express';
import { Kafka } from 'kafkajs';
import cors from "cors";

const app = express();

const kafka = new Kafka({ brokers: ['kafka:9092'] });
const kafkaProducer = kafka.producer();
const kafkaConsumer = kafka.consumer({ groupId: 'matcher-service' });


app.use(express.json());
app.use(cors());


// TODO: Implement PQ instead of just FIFO
// TODO: Have multiple PQs based on topic

// TODO: Implement logic to consume `cancel-match-event` and remove from PQ

interface MatchRequestData {
  userID: string,
  topic: string,
  difficulty: string
}

let matchRequests: MatchRequestData[] = [];

// Start the Kafka Consumer, listen to match events.
(async () => {
  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe({ topic: 'match-events', fromBeginning: false });

  await kafkaConsumer.run({
    eachMessage: async ({ message }) => {
      const matchRequestData = message.value ? JSON.parse(message.value.toString()) : {};
      console.log(`Received match request: ${JSON.stringify(matchRequestData)}`);
      matchRequests.push(matchRequestData); // Store the match requests
    },
  });
})();

// Continuous function to periodically run the matching algorithm
const runMatchingAlgorithm = async () => {
  setInterval(async () => {
    if (matchRequests.length > 1) {
      const matchReqDataA = matchRequests.shift();
      const matchReqDataB = matchRequests.shift();

      // Ensure both requests are valid
      if (matchReqDataA && matchReqDataB) {
        const matchResult = {
          userA: matchReqDataA.userID,
          userB: matchReqDataB.userID,
          topic: matchReqDataA.topic,
        };
        console.log(`Match found: ${JSON.stringify(matchResult)}`);

        // Produce a `match-found-event`
        await kafkaProducer.send({
          topic: 'match-found-events',
          messages: [{ value: JSON.stringify(matchResult) }],
        });
      }
    }
  }, 2000);
};

// Start the producer and the continuous matching algorithm
(async () => {
  await kafkaProducer.connect();
  runMatchingAlgorithm();
})();


app.listen(3003, () => {
    console.log("Server started on port 3003");
});