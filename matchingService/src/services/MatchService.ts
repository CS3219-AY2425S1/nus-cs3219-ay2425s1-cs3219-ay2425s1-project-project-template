import { IQueueService } from "../bootstrap";
import MatchRequest from "../models/MatchRequest";

/**
 * MatchService handles the business logic related to user matching.
 */
export default class MatchService {
    private amqpService: IQueueService;

    constructor(amqpService: IQueueService) {
        this.amqpService = amqpService;
    }

    public async findMatch(name: string, matchId: string, topic: string, difficulty: string ): Promise<boolean> {
        const req = new MatchRequest(name, matchId, topic, difficulty);
        return this.amqpService.sendMatchRequest(req);
    }

    public async cancelMatch(matchId: string): Promise<boolean> {
       return this.amqpService.cancelMatchRequest(matchId);
    }
}