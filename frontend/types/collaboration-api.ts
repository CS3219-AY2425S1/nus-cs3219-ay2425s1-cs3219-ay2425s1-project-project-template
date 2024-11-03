export interface ICollabSession {
    matchId: string
    language: string
    code: string
    executionResult: string
    chatHistory: IChat[]
}

export interface IChat {
    senderId: string
    message: string
    createdAt: Date
    roomId: string
}
