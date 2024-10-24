import matchService from '../services/matchService.js';
const { addMatchRequest, cancelMatchRequest, processMatchQueue } = matchService;

async function handleMatchRequest(req, res) {
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
