export enum DifficultyLevel {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export enum ClientSocketEvents {
  REQUEST_MATCH = "REQUEST_MATCH",
  CANCEL_MATCH = "CANCEL_MATCH",
  // Add other client events as needed
}

export enum ServerSocketEvents {
  MATCH_FOUND = "MATCH_FOUND",
  MATCH_CANCELED = "MATCH_CANCELED",
  // Add other server events as needed
}

export interface MatchRequest {
  selectedDifficulty: DifficultyLevel;
  selectedTopic: string;
  event: ClientSocketEvents.REQUEST_MATCH;
}

export interface MatchCancelRequest {
  event: ClientSocketEvents.CANCEL_MATCH;
}

export interface MatchFoundResponse {
  event: ServerSocketEvents.MATCH_FOUND;
  roomId: string;
  opponentUsername: string;
  questionId: string;
}

export interface ServerToClientEvents {
  [ServerSocketEvents.MATCH_FOUND]: (response: MatchFoundResponse) => void;
  [ServerSocketEvents.MATCH_CANCELED]: () => void;
  // Add other server-to-client events as needed
}

export interface ClientToServerEvents {
  [ClientSocketEvents.REQUEST_MATCH]: (request: MatchRequest) => void;
  [ClientSocketEvents.CANCEL_MATCH]: (request: MatchCancelRequest) => void;
  // Add other client-to-server events as needed
}
