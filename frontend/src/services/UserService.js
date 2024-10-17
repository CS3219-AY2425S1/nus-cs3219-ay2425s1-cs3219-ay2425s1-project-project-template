import { createAxiosInstance } from "./Api";

const userServiceBaseURL = import.meta.env.VITE_USER_SERVICE_BASEURL;

const userApi = createAxiosInstance(userServiceBaseURL);

// This is for creating a new user (Sign Up)
export const createUser = async (user) => {
  try {
    const response = await userApi.post("/users", user);
    return response.data;
  } catch (error) {
    throw new Error("Error creating user", error);
  }
};

// This is for logging in a user
export const loginUser = async (user) => {
  try {
    const response = await userApi.post("/auth/login", user);
    return response.data;
  } catch (error) {
    throw new Error("Invalid login credentials", error);
  }
};
