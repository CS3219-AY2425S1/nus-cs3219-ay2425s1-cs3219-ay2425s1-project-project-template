import { Difficulty, Topic } from "../QueueService/matchingEnums";
import MatchRequest from "./MatchRequest";

export default class MatchRequestWithId extends MatchRequest {
    private matchId: string;

    constructor(userId: string, matchId: string, topic: Topic, difficulty: Difficulty) {
        super(userId, topic, difficulty);
        this.matchId = matchId;
    }

    public getMatchId(): string {
        return this.matchId;
    }
}