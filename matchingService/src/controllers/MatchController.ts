import { Request, Response } from "express";
import MatchRequest from "../models/MatchRequest";
import { QueueService } from "../index";

export default class MatchController {
    private amqpService: QueueService;

    constructor(amqpService: QueueService) {
        this.amqpService = amqpService;
    }

    public async findMatch(req: Request, res: Response) {
        try {
            const { name, matchId, topic, difficulty } = req.body;
            if (!name || !matchId || !topic || !difficulty) {
                return res.status(400).json({ error: "Invalid request data" });
            }

            const matchRequest = new MatchRequest(name, matchId, topic, difficulty);
            const result: boolean = await this.amqpService.sendMessage(matchRequest);

            if (result) {
                res.json({ success: result });
            } else {
                res.status(500).json({ error: "Failed to process match request" });
            }
        } catch (error) {
            console.error("Error handling match request:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    public async cancelMatch(req: Request, res: Response) {
        const matchId: string = req.query.matchId as string;

        if (!matchId) {
            return res.status(400).json({ error: "matchId is required" });
        }

        try {
            const isCancelled: boolean = await this.amqpService.cancelMatchRequest(matchId);
            if (isCancelled) {
                res.json({ success: true });
            } else {
                res.status(404).json({ error: "Match not found or already processed" });
            }
        } catch (error) {
            console.error("Error cancelling match:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
