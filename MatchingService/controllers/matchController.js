import matchService from '../services/matchService.js';
const { addMatchRequest, cancelMatchRequest, processMatchQueue } = matchService;

const VITE_USER_SERVICE_API = 'http://user-service:3001' || 'http://localhost:3001';

/* Verify user's token */
async function verifyUser(token) {
    try {
        console.log("Verifying user " + token);

        const response = await fetch(`${VITE_USER_SERVICE_API}/auth/verify-token`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Include the token in the header if required
            },
        });

        if (!response.ok) {
            // If response is not OK, handle the error
            return false;
        }

        // const data = await response.json();

        // Sending the data from the API call as the response
        return true;
    } catch (error) {
        console.error("Error during authentication:", error);
        return false;
    }
}

async function handleMatchRequest(req, res) {
    const token = req.cookies.accessToken;
    if (!await verifyUser(token)) {
        return res.status(401).json({ message: "Authentication failed" });
    }
    const { userId, topic, difficulty, socketId } = req.body;

    try {
        await addMatchRequest(userId, topic, difficulty, socketId);
        res.status(200).json({ message: "Match request sent", userId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

async function cancelRequest(req, res) {
    const token = req.cookies.accessToken;
    if (!await verifyUser(token)) {
        return res.status(401).json({ message: "Authentication failed" });
    }
    const { userId } = req.body;

    try {
        await cancelMatchRequest(userId);
        res.status(200).json({ message: "Match request cancelled", userId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

function initializeQueueProcessing(io) {
    processMatchQueue(io);
}

export default {
    handleMatchRequest,
    cancelRequest,
    initializeQueueProcessing
};
