import { matchApiClient } from './api-clients';

const MATCH_SERVICE_ROUTES = {
  REQUEST_MATCH: '/request',
  CANCEL_MATCH: '/cancel',
};

export const requestMatch = (data: MatchFormData) => {
  return matchApiClient.post(MATCH_SERVICE_ROUTES.REQUEST_MATCH);
};

export const cancelMatch = () => {
  return matchApiClient.post(MATCH_SERVICE_ROUTES.CANCEL_MATCH);
};
