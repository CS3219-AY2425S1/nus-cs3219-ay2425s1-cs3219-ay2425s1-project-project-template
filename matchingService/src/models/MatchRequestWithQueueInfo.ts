import { Difficulty, Topic } from "../QueueService/matchingEnums";
import MatchRequest from "./MatchRequest";

class MatchRequestWithQueueInfo extends MatchRequest {
    private replyQueue: string;
    private correlationId: string;
    constructor(userId: string, matchId: string, topic: Topic, difficulty: Difficulty, replyQueue: string, correlationId: string) {
        super(userId, matchId, topic, difficulty);
        this.replyQueue = replyQueue;
        this.correlationId = correlationId;
    }

    public getQueue(): string {
        return this.replyQueue;
    }

    public getCorrelationId(): string {
        return this.correlationId;
    }

    public static createFromMatchRequest(matchRequest: MatchRequest, replyQueue: string, correlationId: string): MatchRequestWithQueueInfo {
        return new MatchRequestWithQueueInfo(matchRequest.getUserId(), matchRequest.getMatchId(),
            matchRequest.getTopic(), matchRequest.getDifficulty(), replyQueue, correlationId);
    }
}

export default MatchRequestWithQueueInfo;