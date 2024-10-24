import matchService from '../services/matchService.js';
const { addMatchRequest, cancelMatchRequest, processMatchQueue } = matchService;

async function handleMatchRequest(req, res) {
    const { userId, topic, difficulty } = req.body;

    try {
        console.log(userId);
        await addMatchRequest(userId, topic, difficulty);
        res.status(200).json({ message: "Match request sent", userId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send match request" });
    }
}

async function cancelRequest(req, res) {
    const { userId } = req.body;

    try {
        await cancelMatchRequest(userId);
        res.status(200).json({ message: "Match request cancelled", userId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to cancel match request" });
    }
}

function initializeQueueProcessing() {
    processMatchQueue();
}

export default {
    handleMatchRequest,
    cancelRequest,
    initializeQueueProcessing
};
