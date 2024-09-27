import { createContext, useContext } from 'react';
import { AxiosInstance } from 'axios';

export const ApiContext = createContext<AxiosInstance | null>(null); // Define context type here

// Custom hook to use the context
export const useApiContext = (method : string, url: string) => {
  const context = useContext(ApiContext);

  if (context === null) {
    throw new Error('useApi must be used within an ApiProvider');
  }

  switch(method) {
    case "GET":
        return async () => {
            context.get(url);
        }
    case "POST":
        return async (data: any) => {
            context.post(url, data);
        }

    default: 
        return () => {}
  }
};
