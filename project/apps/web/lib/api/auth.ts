import apiClient from "./apiClient";
import { SignInDto, SignUpDto } from "@repo/dtos/auth";

export const signUp = async (signUpDto: SignUpDto) => {
  const res = await apiClient.post("/auth/signup", signUpDto);
  return res.data;
};

export const signIn = async (signInDto: SignInDto) => {
  const res = await apiClient.post("/auth/signin", signInDto);
  return res.data;
};

export const signOut = async () => {
  await apiClient.post("/auth/signout");
};
