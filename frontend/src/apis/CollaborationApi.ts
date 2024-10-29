import { SessionResponse } from '../types/Collaboration';
import { api } from './ApiClient';

export const checkSession = async (): Promise<SessionResponse> => {
  return api.get('/collab/check-session');
};
