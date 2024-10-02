import { createContext, useContext } from "react";
import {
  RefetchOptions,
  useQuery,
  QueryObserverResult,
} from "@tanstack/react-query";
import { useApiContext } from "./ApiContext";

export type User = {
  user_id: string;
  email: string;
  username: string;
  questions_done: number[] | null;
};

export type UserContext = {
  user: User | null;
  status: "pending" | "error" | "success";
  refetch: () => Promise<QueryObserverResult<User, Error>>;
};

export const UserContext = createContext<UserContext | null>(null); // Define context type here

export const UserProvider = ({
  children,
  isAuth,
}: {
  children: React.ReactNode;
  isAuth: boolean;
}) => {
  const api = useApiContext();

  const { data, status, refetch } = useQuery<User>({
    queryKey: ["user", isAuth],
    queryFn: async () => {
      try {
        const response = await api.get("/profile");

        console.log("response", response);

        if (response.status === 200) {
          return response.data;
        }

        return undefined;
      } catch {
        console.log("Unable to fetch user data");
        return undefined;
      }
    },
    refetchOnWindowFocus: false,
  });

  const user = data === undefined ? null : data;
  const userContext: UserContext = {
    user,
    status,
    refetch,
  };

  console.log("UserContext", userContext);

  return (
    <UserContext.Provider value={userContext}>{children}</UserContext.Provider>
  );
};

// Custom hook to use the context
// export const useUserContext = (): AxiosInstance => {
//   const context = useContext(ApiContext);

//   if (context === null) {
//     throw new Error("useApi must be used within an ApiProvider");
//   }

//   return context;
// };
