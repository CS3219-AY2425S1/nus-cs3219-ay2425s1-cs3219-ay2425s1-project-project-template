import Service from "./QueueService/Service";
import MatchService from "./services/MatchService";
import MatchController from "./controllers/MatchController";
import MatchRequest from "./models/MatchRequest";

export interface QueueService {
    sendMessage(matchRequest: MatchRequest): Promise<boolean>;
    cancelMatchRequest(matchId: string): Promise<boolean>;
}

/**
 * Initializes and returns the match controller.
 */
export async function initialiseServices(): Promise<MatchController> {
    const amqpService: QueueService = await Service.of(process.env.RABBITMQ_URL || "amqp://localhost:5672", "gateway", "responseGateway");
    const matchService = new MatchService(amqpService);
    const matchController = new MatchController(matchService);

    return matchController;
}
