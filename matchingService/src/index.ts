import express, { Application, Request, Response } from "express";
import Service from "./QueueService/Service";
import MatchRequest from "./models/MatchRequest";
import createRouter from "./routes";
import MatchController from "./controllers/MatchController";
import MatchService from "./services/MatchService";

export interface QueueService {
    sendMessage(matchRequest: MatchRequest): Promise<boolean>;
    cancelMatchRequest(matchId: string): Promise<boolean>;
}

var amqpService: QueueService;
var matchService: MatchService;
var matchController: MatchController;

async function main() {
    const app: Application = express();
    await instantiateControllerServices();
    app.use(express.json());
    app.use('/match', createRouter(matchController));

    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}

async function instantiateControllerServices() {
    amqpService = await Service.of(process.env.RABBITMQ_URL || "amqp://localhost:5672", "gateway", "responseGateway");
    matchService = new MatchService(amqpService);
    matchController = new MatchController(matchService);
}

main();
