import axios, { AxiosError } from 'axios';
export interface UserCredentials {
  username?: string;
  email: string;
  password: string;
}

export interface LoginTokens {
  token: string;
  refreshToken: string;
}

export const login = async (credentials: UserCredentials): Promise<{ token: string, refreshToken: string }> => {
  try {
    const response = await fetch("http://localhost:8080/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Invalid email or password");
    }

    const data : LoginTokens = await response.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);

    return {
      token: data.token,
      refreshToken: data.refreshToken,
    };

  } catch (error: Error | AxiosError) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.message || "Login error"); 
    } else {
      return Promise.reject("Login error");
    }
  }
};

export const register = async (credentials: UserCredentials): Promise<string> => {
  try {
    const response = await fetch("http://localhost:8080/v1/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();
    return data.message; 
  } catch (error: Error | AxiosError) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.message || "Registration error");
    } else {
      return Promise.reject("Registration error");
    }
  }
};

export const logout = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  // try {
  //   const response = await fetch("http://localhost:8080/v1/logout", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     credentials: 'include',
  //   });

  //   if (!response.ok) {
  //     const errorData = await response.json();
  //     throw new Error(errorData.message || "Logout failed");
  //   }

  //   return;
  // } catch (error: any) {
  //   return Promise.reject(error.message || "Logout error");
  // }
}