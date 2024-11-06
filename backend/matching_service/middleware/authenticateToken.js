const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(401).json({ message: "Token required" });

  try {
    console.log("Authenticating token");
    // Verify the token with the user service
    const userServiceBackendUrl = (process.env.USER_SERVICE_BACKEND_URL || "http://localhost:5001") + "/verify-token";
    const response = await fetch(userServiceBackendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const userData = await response.json();
      req.user = userData; // Store user data in request
      next();
    } else {
      const errorData = await response.json(); // Get the error response
      res
        .status(response.status)
        .json({ message: errorData.message || "Invalid Token" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Question Service Server Error" });
  }
};

const authenticateTokenSocket = async (socket, next) => {
  console.log("Authenticating socket token");
  const token = socket.handshake.auth.token;

  if (token == null) next(new Error("Token required"));

  try {
    // Verify the token with the user service
    const userServiceBackendUrl = (process.env.USER_SERVICE_BACKEND_URL || "http://localhost:5001") + "/verify-token";
    const response = await fetch(userServiceBackendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      next();
    } else {
      const errorData = await response.json(); // Get the error response
      next(new Error(errorData.message || "Invalid Token"));
    }
  } catch (error) {
    next(new Error("Internal Question Service Server Error"));
  }
};

module.exports = { authenticateToken, authenticateTokenSocket };
