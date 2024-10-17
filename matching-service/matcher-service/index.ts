import express from 'express';
import { Kafka } from 'kafkajs';

const app = express();

const kafka = new Kafka({ brokers: ['kafka:9092'] });
const kafkaProducer = kafka.producer();
const kafkaConsumer = kafka.consumer({ groupId: 'request-service' });


app.use(express.json());


// TODO: Implement logic to consume `match-event` and add to PQ
// TODO: Implement logic to consume `cancel-match-event` and remove from PQ
// TODO: Implement logic to periodically run matching algorithm
// TODO: Implement logic to produce `match-found-event`




app.listen(3003, () => {
    console.log("Server started on port 3003");
});