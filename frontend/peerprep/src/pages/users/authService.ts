export interface UserCredentials {
  username?: string;
  email: string;
  password: string;
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

    const data = await response.json();
    return {
      token: data.token,
      refreshToken: data.refreshToken,
    };

  } catch (error: any) {
    return Promise.reject(error.message || "Login error");
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
  } catch (error: any) {
    return Promise.reject(error.message || "Registration error");
  }
};