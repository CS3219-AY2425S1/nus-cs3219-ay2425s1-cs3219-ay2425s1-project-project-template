import { IUserCredentials } from '@/types/user-types';
import { userApiClient } from './api-clients';

export const login = async (userCredentials: IUserCredentials): Promise<void> => {
  const response = await userApiClient.post(`/login`, userCredentials);
  return response.data;
};
