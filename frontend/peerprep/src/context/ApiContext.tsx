import { createContext, useContext } from 'react';
import { AxiosInstance, AxiosResponse } from 'axios';

export const ApiContext = createContext<AxiosInstance | null>(null); // Define context type here

export type GetRequest = () => AxiosResponse<any>;
export type PostRequest = (data: any) => Promise<void>;

// Custom hook to use the context
export const useApiContext = () : AxiosInstance => {
  const context = useContext(ApiContext);

  if (context === null) {
    throw new Error('useApi must be used within an ApiProvider');
  }

  return context
};
