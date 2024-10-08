import { QueueService } from "..";
import MatchRequest from "../models/MatchRequest";

/**
 * MatchService handles the business logic related to user matching.
 */
export default class MatchService {
    private amqpService: QueueService;

    constructor(amqpService: QueueService) {
        this.amqpService = amqpService;
    }

    public async findMatch(name: string, matchId: string, topic: string, difficulty: string ): Promise<boolean> {
        const req = new MatchRequest(name, matchId, topic, difficulty);
        return this.amqpService.sendMessage(req);
    }

    public async cancelMatch(matchId: string): Promise<boolean> {
       return this.amqpService.cancelMatchRequest(matchId);
    }
}