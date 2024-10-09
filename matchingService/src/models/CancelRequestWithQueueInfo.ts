import { Difficulty, Topic } from "../QueueService/matchingEnums";
import CancelRequest from "./CancelRequest";

/**
 * CancelRequestWithQueueInfo stores additional information - response queue and correlationid. 
 * This enables the consumer to remember which repsonse queue to reply to.
 */
class CancelRequestWithQueueInfo extends CancelRequest {
    private static readonly EXPIRATION_DURATION = 1 * 60 * 1000;
    private replyQueue: string;
    private correlationId: string;
    private timestamp: Date;

    constructor(matchId: string, difficulty: Difficulty, topic: Topic, replyQueue: string, correlationId: string) {
        super(matchId, difficulty, topic);
        this.replyQueue = replyQueue;
        this.correlationId = correlationId;
        this.timestamp = new Date();
    }

    public getQueue(): string {
        return this.replyQueue;
    }

    public getCorrelationId(): string {
        return this.correlationId;
    }

    public static createFromCancelRequest(cancelRequest: CancelRequest, replyQueue: string, correlationId: string): CancelRequestWithQueueInfo {
        return new CancelRequestWithQueueInfo(cancelRequest.getMatchId(), 
            cancelRequest.getDifficulty(), cancelRequest.getTopic(), replyQueue, correlationId);
    }

    public hasExpired(): boolean {
        const currentTime = new Date().getTime();
        return currentTime - this.timestamp.getTime() > CancelRequestWithQueueInfo.EXPIRATION_DURATION;
    }
}

export default CancelRequestWithQueueInfo;