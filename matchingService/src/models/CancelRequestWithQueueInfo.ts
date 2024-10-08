import CancelRequest from "./CancelRequest";

class CancelRequestWithQueueInfo extends CancelRequest {
    private replyQueue: string;
    private correlationId: string;
    constructor(matchId: string, replyQueue: string, correlationId: string) {
        super(matchId);
        this.replyQueue = replyQueue;
        this.correlationId = correlationId;
    }

    public getQueue(): string {
        return this.replyQueue;
    }

    public getCorrelationId(): string {
        return this.correlationId;
    }

    public static createFromCancelRequest(cancelRequest: CancelRequest, replyQueue: string, correlationId: string): CancelRequestWithQueueInfo {
        return new CancelRequestWithQueueInfo(cancelRequest.getMatchId(), replyQueue, correlationId);
    }
}

export default CancelRequestWithQueueInfo;