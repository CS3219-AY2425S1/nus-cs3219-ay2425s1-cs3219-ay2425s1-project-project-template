export enum ServicesSocket {
  MATCHING_SERVICE = "matching_service",
}

export enum ClientSocketEvents {
  REQUEST_MATCH = "requestMatch",
  CANCEL_MATCH_REQUEST = "cancelMatchRequest",
}

export enum ServerSocketEvents {
  MATCH_FOUND = "matchFound",
  MATCH_CANCELLED = "matchCancelled",
  MATCHING_TIMEOUT = "matchingTimeout",
}

export function getTargetService(
  event: ClientSocketEvents
): ServicesSocket | null {
  switch (event) {
    case ClientSocketEvents.REQUEST_MATCH:
    case ClientSocketEvents.CANCEL_MATCH_REQUEST:
      return ServicesSocket.MATCHING_SERVICE;
    default:
      return null;
  }
}
