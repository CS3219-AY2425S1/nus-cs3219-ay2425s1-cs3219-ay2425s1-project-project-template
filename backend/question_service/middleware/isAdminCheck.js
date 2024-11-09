const isAdminCheck = async (req, res, next) => {
    // Extract the token from the request headers
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: "Authorization token is required." });
    }

    try {
        // Make a request to the user-service to check admin status
        const userServiceBackendUrl = process.env.USER_SERVICE_BACKEND_URL || "http://localhost:5001";
        const response = await fetch(`${userServiceBackendUrl}/admin/checkAdminStatus`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (!response.ok) {
            return res.status(403).json({ message: "A problem occurred fetching admin status." });
        }

        const data = await response.json();

        if (!data.isAdmin) {
            return res.status(403).json({ message: "Access denied. You are not an admin." });
        }

        // If the user is an admin, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Error checking admin status:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = isAdminCheck;