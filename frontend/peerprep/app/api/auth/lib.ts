import { SessionOptions } from "iron-session";
import { env } from "next-runtime-env";

const SECRET_KEY =
  env("SECRET_KEY") || "ThisIsASecretKeyMaybeYouShouldChangeIt";

export interface SessionData {
  userId?: string;
  username?: string;
  isAdmin?: boolean;
  accessToken?: string;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: SECRET_KEY,
  cookieName: "peerprep-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};
