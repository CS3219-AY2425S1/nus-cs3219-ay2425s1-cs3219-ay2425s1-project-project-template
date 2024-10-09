import { Difficulty, Topic } from "../QueueService/matchingEnums";

class CancelRequest {
    private matchId: string;
    private difficulty: Difficulty;
    private topic: Topic;

    constructor(matchId: string, difficulty: Difficulty, topic: Topic) {
        this.matchId = matchId;
        this.difficulty = difficulty;
        this.topic = topic;
    }
    public getMatchId(): string {
        return this.matchId;
    }

    public getDifficulty(): Difficulty {
        return this.difficulty;
    }

    public getTopic(): Topic {
        return this.topic;
    }
}
export default CancelRequest;