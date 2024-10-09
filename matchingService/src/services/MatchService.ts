import { IQueueService } from "../bootstrap";
import MatchRequest from "../models/MatchRequest";

/**
 * MatchService handles the business logic related to user matching.
 */
export default class MatchService {
    private queueService: IQueueService;

    constructor(queueService: IQueueService) {
        this.queueService = queueService;
    }

    public async findMatch(name: string, matchId: string, topic: string, difficulty: string ): Promise<boolean> {
        const req = new MatchRequest(name, matchId, topic, difficulty);
        return this.queueService.sendMatchRequest(req);
    }

    public async cancelMatch(matchId: string): Promise<boolean> {
       return this.queueService.cancelMatchRequest(matchId);
    }
}