import QueueService from "./QueueService/QueueService";
import MatchService from "./services/MatchService";
import MatchController from "./controllers/MatchController";
import MatchRequest from "./models/MatchRequest";

export interface IQueueService {
    sendMatchRequest(matchRequest: MatchRequest): Promise<boolean>;
    cancelMatchRequest(matchId: string): Promise<boolean>;
}

/**
 * Initializes and returns the match controller.
 */
export async function initialiseServices(): Promise<MatchController> {
    const queueService: QueueService = await QueueService.of(process.env.RABBITMQ_URL || "amqp://localhost:5672", "gateway", "responseGateway");
    const matchService = new MatchService(queueService);
    const matchController = new MatchController(matchService);

    return matchController;
}
