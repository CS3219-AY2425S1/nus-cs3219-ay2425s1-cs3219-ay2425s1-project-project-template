import { createAxiosInstance } from "./Api";

const userServiceBaseURL = import.meta.env.VITE_USER_SERVICE_BASEURL;

const userApi = createAxiosInstance(userServiceBaseURL);

export const createUser = async (user) => {
  try {
    const response = await userApi.post("/users", user);
    return response.data;
  } catch (error) {
    throw new Error("Error creating user", error);
  }
};
