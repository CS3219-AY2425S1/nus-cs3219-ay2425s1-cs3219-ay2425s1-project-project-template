/* eslint-disable */

import toast from "@/components/modals/toast";
import { AuthStatus } from "@/types/user";
import Cookie from "js-cookie";

export const setToken = (token: string) => {
  Cookie.set("token", token, { expires: 1 });
};

export const getToken = () => {
  return Cookie.get("token");
};

export const setUsername = (username: string) => {
  Cookie.set("username", username, { expires: 1 });
}

export const getUsername = () => {
  return Cookie.get("username");
}

export const setUserId = (id: string) => {
  Cookie.set("id", id, { expires: 1 });
}

export const getUserId = () => {
  return Cookie.get("id");
}

export const setIsAdmin = (isAdmin: boolean) => {
  Cookie.set("isAdmin", isAdmin ? "Y" : "N", { expires: 1 });
}

export const getIsAdmin = (): boolean => {
  return Cookie.get("isAdmin") == "Y";
}

export const getAuthStatus = () => {
  if (!getToken()) return AuthStatus.UNAUTHENTICATED;
  if (getIsAdmin()) return AuthStatus.ADMIN;
  return AuthStatus.AUTHENTICATED;
}

const NEXT_PUBLIC_USER_SERVICE = process.env.NEXT_PUBLIC_USER_SERVICE || "https://user-service-598285527681.us-central1.run.app";

export const verifyToken = async (token: string) => {
  const response = await fetch(
    `${NEXT_PUBLIC_USER_SERVICE}/auth/verify-token`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status !== 200) {
    Cookie.remove("token");
    Cookie.remove("username");
    Cookie.remove("id");
    Cookie.remove("isAdmin");
    return false;
  }

  const data = await response.json();
  setUsername(data.data.username);
  setIsAdmin(data.data.isAdmin);
  setUserId(data.data.id);
  return response.status === 200;
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${NEXT_PUBLIC_USER_SERVICE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const data = await response.json();

  if (response.status !== 200) {
    toast.fire({
      icon: "error",
      title: data.message,
    });
    return false;
  }

  setToken(data.data.accessToken);
  setUsername(data.data.username);
  setIsAdmin(data.data.isAdmin);
  setUserId(data.data.id);

  return true;
};

export const logout = () => {
  Cookie.remove("token");
  Cookie.remove("username");
  Cookie.remove("id");
  Cookie.remove("isAdmin");

  window.location.href = "/";
};

export const register = async (
  email: string,
  password: string,
  username: string
) => {
  const response = await fetch(`${NEXT_PUBLIC_USER_SERVICE}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password: password,
      username,
    }),
  });
  const data = await response.json();

  if (response.status !== 201) {
    toast.fire({
      icon: "error",
      title: data.message,
    });
    return false;
  }

  return true;
};

// optional userId parameter
export const getUser = async (userId = "") => {
  const token = getToken();
  const url = `${NEXT_PUBLIC_USER_SERVICE}/users/${userId || getUserId()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();

  if (response.status !== 200) {
    toast.fire({
      icon: "error",
      title: data.message,
    });
    return false;
  }

  return data;
};

export const updateUser = async (userData: {
  username?: string;
  email?: string;
  password?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
}) => {
  const token = getToken();
  const userId = getUserId();
  const response = await fetch(`${NEXT_PUBLIC_USER_SERVICE}/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();

  if (response.status !== 200) {
    toast.fire({
      icon: "error",
      title: data.message,
    });
    return false;
  }

  toast.fire({
    icon: "success",
    title: "Profile updated successfully",
  });

  return true;
};
