export interface TimedMatchRequest {
    name: string
    difficulty: string
    category: string[]
    timestamp: number
}

export interface MatchPartner {
    name: string
    difficulty: string
    category: string[]
}

export interface MatchResponse {
    first: MatchPartner
    second: MatchPartner
}