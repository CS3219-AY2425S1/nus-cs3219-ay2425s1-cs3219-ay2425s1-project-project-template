export interface TimedMatchRequest {
    name: string
    difficulty: string
    category: string[]
    timestamp: number
}

export interface MatchPartner {
    name: string
    questionId: number,
    title: string,
    difficulty: string
    category: string[]
}
