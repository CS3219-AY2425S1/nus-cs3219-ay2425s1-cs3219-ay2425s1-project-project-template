import { IQueueService } from "../config/bootstrap";
import MatchRequest from "../models/MatchRequest";
import { Difficulty, Topic } from "../QueueService/matchingEnums";

/**
 * MatchService handles the business logic related to user matching.
 */
export default class MatchService {
    private queueService: IQueueService;

    constructor(queueService: IQueueService) {
        this.queueService = queueService;
    }

    public async findMatch(name: string, matchId: string, topic: Topic, difficulty: Difficulty ): Promise<boolean> {
        const req = new MatchRequest(name, matchId, topic, difficulty);
        return this.queueService.sendMatchRequest(req);
    }

    public async cancelMatch(matchId: string): Promise<void> {
       return this.queueService.cancelMatchRequest(matchId);
    }
}