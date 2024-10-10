import { Difficulty, Topic } from "../QueueService/matchingEnums";
import MatchRequest from "./MatchRequest";
import MatchRequestWithId from "./MatchRequestWIthId";

/**
 * MatchRequestWithQueueInfo stores additional information - response queue and correlationid. 
 * This enables the consumer to remember which repsonse queue to reply to.
 */
class MatchRequestWithQueueInfo extends MatchRequest {
    private matchId: string;
    private replyQueue: string;
    private correlationId: string;
    constructor(userId: string, matchId: string, topic: Topic, difficulty: Difficulty, replyQueue: string, correlationId: string) {
        super(userId, topic, difficulty);
        this.matchId = matchId;
        this.replyQueue = replyQueue;
        this.correlationId = correlationId;
    }

    public getMatchId(): string {
        return this.matchId;
    }

    public getQueue(): string {
        return this.replyQueue;
    }

    public getCorrelationId(): string {
        return this.correlationId;
    }

    public static createFromMatchRequestWithId(req: MatchRequestWithId, replyQueue: string, correlationId: string): MatchRequestWithQueueInfo {
        return new MatchRequestWithQueueInfo(req.getUserId(), req.getMatchId(),
        req.getTopic(), req.getDifficulty(), replyQueue, correlationId);
    }
}

export default MatchRequestWithQueueInfo;