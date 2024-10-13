export interface MatchRequest {
    name: string
    difficulty: string
    category: string[]
}

export interface TimedMatchRequest extends MatchRequest {
    timestamp: number
}

export interface MatchResponse {
    first: MatchRequest
    second: MatchRequest
}