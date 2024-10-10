import { Topic, Difficulty } from '../QueueService/matchingEnums';

class MatchRequest {
    private userId: string;
    private topic: Topic;
    private difficulty: Difficulty;

    constructor(userId: string, topic: Topic, difficulty: Difficulty) {
        this.userId = userId;
        this.topic = topic;
        this.difficulty = difficulty;
    }

    public getUserId(): string {
        return this.userId;
    }

    public getTopic(): Topic {
        return this.topic;
    }

    public getDifficulty(): Difficulty {
        return this.difficulty;
    }
}

export default MatchRequest;