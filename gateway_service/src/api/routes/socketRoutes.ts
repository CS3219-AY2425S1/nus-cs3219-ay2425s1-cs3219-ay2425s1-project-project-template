import { ClientSocketEvents, ServicesSocket } from "peerprep-shared-types";

export function getTargetService(
  event: ClientSocketEvents
): ServicesSocket | null {
  switch (event) {
    case ClientSocketEvents.REQUEST_MATCH:
    case ClientSocketEvents.CANCEL_MATCH:
      return ServicesSocket.MATCHING_SERVICE;
    default:
      return null;
  }
}
