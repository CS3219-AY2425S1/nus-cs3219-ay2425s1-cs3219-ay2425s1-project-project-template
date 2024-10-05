export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt?: string;
}

export interface UpdateUserRequestType {
  username?: string;
  password?: string;
  email?: string;
}

export interface UpdateUserResponseType {
  message: string;
  data: User;
}

export interface VerifyTokenResponseType {
  message: string;
  data: User;
}

export const UpdateUser = async (
  user: UpdateUserRequestType,
  id: string
): Promise<UpdateUserResponseType> => {
  const JWT_TOKEN = localStorage.getItem("TOKEN") ?? undefined;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}users/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT_TOKEN}`,
      },
      body: JSON.stringify(user),
    }
  );

  if (response.status === 200) {
    return response.json();
  } else {
    throw new Error(
      `Error updating user: ${response.status} ${response.statusText}`
    );
  }
};

export const ValidateUser = async (): Promise<VerifyTokenResponseType> => {
  const JWT_TOKEN = localStorage.getItem("TOKEN") ?? undefined;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}auth/verify-token`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT_TOKEN}`,
      },
    }
  );

  if (response.status === 200) {
    return response.json();
  } else {
    throw new Error(
      `Error verifying token: ${response.status} ${response.statusText}`
    );
  }
};
