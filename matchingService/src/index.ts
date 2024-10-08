import express, { Application, Request, Response } from "express";
import Service from "./QueueService/Service";
import MatchRequest from "./models/MatchRequest";
import createRouter from "./routes";

export interface QueueService {
    sendMessage(matchRequest: MatchRequest): Promise<boolean>;
    cancelMatchRequest(matchId: string): Promise<boolean>;
}

async function main() {
    var amqpService: QueueService = await Service.of(process.env.RABBITMQ_URL || "amqp://localhost:5672", "gateway", "responseGateway");

    const app: Application = express();
    app.use(express.json());
    app.use('/match', createRouter(amqpService));

    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}

main();
