/* eslint-disable */

import toast from "@/components/modals/toast";

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const setBaseUserData = (data: { username: string, id: string, isAdmin: string }) => {
  localStorage.setItem("username", data.username);
  localStorage.setItem("id", data.id);
  localStorage.setItem("isAdmin", data.isAdmin);
}

export const getBaseUserData = () => {
  return {
    username: localStorage.getItem("username"),
    id: localStorage.getItem("id"),
    isAdmin: localStorage.getItem("isAdmin"),
  };
}

const NEXT_PUBLIC_USER_SERVICE = process.env.NEXT_PUBLIC_USER_SERVICE;

export const verifyToken = async (needsLogin: boolean) => {
  const token = getToken();
  if (!token) {
    if (needsLogin) logout();
    return false;
  }

  const response = await fetch(`${NEXT_PUBLIC_USER_SERVICE}/auth/verify-token`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  switch (response.status) {
    case 200:
      return true;
    case 401:
      // if (needsLogin) logout();
      return false;
    default:
      // if (needsLogin) logout();
      return false;
  }
};

export const login = async (email: string, password: string) => {
  const encryptedPassword = btoa(password);
  const response = await fetch(`${NEXT_PUBLIC_USER_SERVICE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password: encryptedPassword,
    }),
  });

  switch (response.status) {
    case 200:
      return handleSuccessfulLogin(response);
    case 401:
      toast.fire({
        icon: "error",
        title: "Invalid email or password",
      });
      break;
    default:
      toast.fire({
        icon: "error",
        title: "An error occurred while logging in",
      });
  }
};

export const handleSuccessfulLogin = async (response: Response) => {
  const { accessToken, username, id, isAdmin } = await response.json();
  setBaseUserData({ username, id, isAdmin });
  setToken(accessToken);
  const redirect = localStorage.getItem("redirect");
  if (!redirect) {
    window.location.href = "/";
    return;
  }

  localStorage.removeItem("redirect");
  window.location.href = redirect;
  return;
};

export const redirectToLogin = async () => {
  localStorage.setItem("redirect", window.location.pathname);
  window.location.href = "/login";
}

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("id");
  localStorage.removeItem("isAdmin");
  redirectToLogin().then(() => {
    toast.fire({
      icon: "success",
      title: "Logged out successfully",
    });
  })
};

export const register = async (email: string, password: string, username: string) => {
  const encryptedPassword = btoa(password);
  const response = await fetch(`${NEXT_PUBLIC_USER_SERVICE}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password: encryptedPassword,
      username,
    }),
  });

  switch (response.status) {
    case 201:
      return handleSuccessfulLogin(response);
    case 400:
      toast.fire({
        icon: "error",
        title: "Invalid email or password",
      });
      break;
    case 409:
      toast.fire({
        icon: "error",
        title: "User already exists",
      });
      break;
    default:
      toast.fire({
        icon: "error",
        title: "An error occurred while registering",
      });
  }
}

export const getUser = async () => {
  const token = getToken();
  const { id } = getBaseUserData();
  const response = await fetch(`${NEXT_PUBLIC_USER_SERVICE}/users/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  switch (response.status) {
    case 200:
      return await response.json();
    case 401:
      logout();
      break;
    default:
      toast.fire({
        icon: "error",
        title: "An error occurred while fetching your profile",
      });
  }
}

export const updateUser = async (data: { email: string, password: string, bio: string, linkedin: string, github: string }) => {
  const token = getToken();
  const { id } = getBaseUserData();
  const response = await fetch(`${NEXT_PUBLIC_USER_SERVICE}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  switch (response.status) {
    case 200:
      return response;
    case 400:
      toast.fire({
        icon: "error",
        title: "Invalid data",
      });
      break;
    default:
      toast.fire({
        icon: "error",
        title: "An error occurred while updating your profile",
      });
  }
}
