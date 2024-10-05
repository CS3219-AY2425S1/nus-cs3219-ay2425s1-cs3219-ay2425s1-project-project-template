import { createContext, useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { AxiosInstance } from "axios";

export type User = {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string; // You can use Date if it's parsed as a date
  // questions_done: number[] | null; (TODO)
};

export type UserContextType = {
  user: User | null;
  status: "pending" | "error" | "success";
  loading: boolean; // Expose loading state
  refetch: () => Promise<void>; // Refetch function
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({
  children,
  isAuth,
  authApi,
}: {
  children: React.ReactNode;
  isAuth: boolean;
  authApi: AxiosInstance;
}) => {
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"pending" | "error" | "success">("pending");
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    setLoading(true);
    setStatus("pending"); // Set status to pending while fetching
    try {
      const response = await authApi.get(`/auth/verify-token`);
      if (response.status === 200) {
        const fetchedUser = response.data.data;
        setUser({
          id: fetchedUser.id,
          username: fetchedUser.username,
          email: fetchedUser.email,
          isAdmin: fetchedUser.isAdmin,
          createdAt: fetchedUser.createdAt,
          // questions_done: fetchedUser.questions_done || null,
        });
        setStatus("success");
      }
    } catch (error: unknown) {
      setStatus("error");
      if (error instanceof Error) {
        console.log({
          title: "Error fetching user data.",
          description: error.message || "An error occurred.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.log({
          title: "Error fetching user data.",
          description: "An unexpected error occurred.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth) {
      fetchUserData(); // Fetch user data when authenticated

      // Set up an interval to refresh user data every 5s
      const interval = setInterval(() => {
        fetchUserData();
      }, 5000); // Adjust the interval time as needed

      return () => {
        clearInterval(interval); // Clear the interval on component unmount
      };
    }
  }, [isAuth]);

  const userContext: UserContextType = {
    user,
    status,
    loading, // Expose loading state
    refetch: fetchUserData,
  };

  return (
    <UserContext.Provider value={userContext}>
      {children}
    </UserContext.Provider>
  );
};