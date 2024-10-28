export type AuthResponse = {
  token: string;
  userId: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type ForgotPasswordInput = {
  email: string;
}

export type ResetPasswordInput = {
  password: string;
  token: string;
}

export type UpdateProfileInput = {
  username: string;
  password: string;
}

export type Profile = {
    id: string;
    email: string;
    username: string;
    lastLogin: string;
}