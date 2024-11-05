import { useQuery, useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import axios from "@/utils/axios";
import { SaveCodeVariables } from "@/utils/collaboration";

export const useGetMatchedQuestion = (roomId: string) => {
  return useQuery({
    queryKey: [roomId],
    queryFn: async () => {
      const response = await axios.get(
        `/collaboration-service/get-question?roomId=${roomId}`,
      );

      return response.data;
    },
    enabled: !!roomId,
  });
};

export const useGetIsAuthorisedUser = (roomId: string, userId: string) => {
  return useQuery({
    queryKey: [roomId, userId],
    queryFn: async () => {
      const response = await axios.get(
        `/collaboration-service/check-authorization?roomId=${roomId}&userId=${userId}`,
      );

      return response.data;
    },
    enabled: !!roomId && !!userId,
  });
};

export const useSaveCode = () => {
  return useMutation<AxiosResponse, AxiosError, SaveCodeVariables>({
    mutationFn: async (savedCode: SaveCodeVariables) => {
      return axios.post(`/collaboration-service/save-code`, savedCode);
    },
  });
};
