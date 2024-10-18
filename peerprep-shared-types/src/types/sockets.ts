import { DifficultyLevel } from "./question";

export enum ClientSocketEvents {
  REQUEST_MATCH = "REQUEST_MATCH",
  CANCEL_MATCH = "CANCEL_MATCH",
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
}

export enum ServerSocketEvents {
  MATCH_FOUND = "MATCH_FOUND",
  MATCH_CANCELED = "MATCH_CANCELED",
  MATCH_REQUESTED = "MATCH_REQUESTED",
  MATCH_TIMEOUT = "MATCH_TIMEOUT",
}

// Matching service
export interface MatchRequest {
  selectedDifficulty: DifficultyLevel;
  selectedTopic: string;
  event: ClientSocketEvents.REQUEST_MATCH;
  username: string;
  timestamp?: string;
}

export interface MatchCancelRequest {
  event: ClientSocketEvents.CANCEL_MATCH;
  username: string;
  timestamp?: string;
}

export interface MatchAddedResponse {
  event: ServerSocketEvents.MATCH_REQUESTED;
  username: string;
}

export interface MatchCancelResponse {
  event: ServerSocketEvents.MATCH_CANCELED;
  username: string;
}

export interface MatchFoundResponse {
  event: ServerSocketEvents.MATCH_FOUND;
  roomId: string;
  opponentUsername: string;
  questionId: string;
}

export interface MatchTimeoutResponse {
  event: ServerSocketEvents.MATCH_TIMEOUT;
  username: string;
}

export interface RoomJoinRequest {
  event: ClientSocketEvents.JOIN_ROOM;
  roomId: string;
  username: string;
}

export interface RoomLeaveRequest {
  event: ClientSocketEvents.LEAVE_ROOM;
  roomId: string;
  username: string;
}

export interface ServerToClientEvents {
  [ServerSocketEvents.MATCH_REQUESTED]: (response: MatchAddedResponse) => void;
  [ServerSocketEvents.MATCH_TIMEOUT]: (response: MatchTimeoutResponse) => void;
  [ServerSocketEvents.MATCH_FOUND]: (response: MatchFoundResponse) => void;
  [ServerSocketEvents.MATCH_CANCELED]: (response: MatchCancelResponse) => void;
}

export interface ClientToServerEvents {
  [ClientSocketEvents.REQUEST_MATCH]: (request: MatchRequest) => void;
  [ClientSocketEvents.CANCEL_MATCH]: (request: MatchCancelRequest) => void;
  [ClientSocketEvents.JOIN_ROOM]: (request: RoomJoinRequest) => void;
  [ClientSocketEvents.LEAVE_ROOM]: (request: RoomLeaveRequest) => void;
}

export enum ServicesSocket {
  MATCHING_SERVICE = "matching_service",
}
