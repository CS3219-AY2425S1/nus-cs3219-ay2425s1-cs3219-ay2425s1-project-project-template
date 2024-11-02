import { useQuery } from "@tanstack/react-query";

import axios from "@/utils/axios";

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
