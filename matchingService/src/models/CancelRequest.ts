class CancelRequest {
    private matchId: string;

    constructor(matchId: string) {
        this.matchId = matchId;
    }
    public getMatchId(): string {
        return this.matchId;
    }
}
export default CancelRequest;