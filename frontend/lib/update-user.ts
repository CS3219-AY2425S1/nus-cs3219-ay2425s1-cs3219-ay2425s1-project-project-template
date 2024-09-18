export const updateUser = async (
    jwtToken: string,
    id: string,
    username?: string,
    email?: string,
  ) => {
    if (!username && !email) {
      throw new Error("Require at least one field");
    }

    const body = {};
    if (username) {
      body["username"] = username;
    }
    if (email) {
      body["email"] = email;
    }

    const response = await fetch(`http://localhost:3001/users/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response;
  };
  