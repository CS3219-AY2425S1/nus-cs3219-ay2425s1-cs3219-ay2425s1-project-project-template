import { IRequestMatchResponse } from '@/types/match-types';
import { matchApiClient } from './api-clients';
import { MatchFormData } from '@/routes/match/logic';

const MATCH_SERVICE_ROUTES = {
  REQUEST_MATCH: '/request',
  CANCEL_MATCH: '/cancel',
};

export const requestMatch = (data: MatchFormData): Promise<IRequestMatchResponse> => {
  return matchApiClient.post(MATCH_SERVICE_ROUTES.REQUEST_MATCH, data).then((res) => {
    return res.data as IRequestMatchResponse;
  });
};

export const cancelMatch = () => {
  return matchApiClient.post(MATCH_SERVICE_ROUTES.CANCEL_MATCH);
};
