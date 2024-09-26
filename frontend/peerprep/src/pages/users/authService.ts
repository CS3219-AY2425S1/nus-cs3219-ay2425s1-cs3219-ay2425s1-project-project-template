export interface UserCredentials {
  username?: string;
  email: string;
  password: string;
}

export const login = async (credentials: UserCredentials): Promise<{ token: string, refreshToken: string }> => {
  try {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await response.json();
    return {
      token: data.token,
      refreshToken: data.refreshToken,
    };
  } catch (error) {
    return Promise.reject("Login error");
  }
};

export const register = async (credentials: UserCredentials): Promise<string> => {
  try {
    const response = await fetch("http://localhost:8080/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const data = await response.json();
    return data.message; // Assuming the API returns a success message
  } catch (error) {
    return Promise.reject("Registration error");
  }
};