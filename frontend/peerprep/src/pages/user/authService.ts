const API_URL = import.meta.env.VITE_API_URL;

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
    const response = await fetch(`${API_URL}/v1/login`, {
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

export const sendResetLink = async (email: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/v1/email-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send reset link");
    }
  } catch (error: any) {
    return Promise.reject(error.message || "Reset link error");
  }
};

export const resetPassword = async (newPassword: string, token: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/v1/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": token
      },
      body: JSON.stringify({ new_password: newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to reset password");
    }
  } catch (error: any) {
    return Promise.reject(error.message || "Password reset error");
  }
};