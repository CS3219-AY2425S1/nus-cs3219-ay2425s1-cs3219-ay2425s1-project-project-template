import { userServiceUri } from "@/lib/api-uri";

export const signUp = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await fetch(`${userServiceUri}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
  return response;
};
