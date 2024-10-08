import { Request, Response } from "express";
import MatchService from "../services/MatchService";

export default class MatchController {
    private matchService: MatchService;

    constructor(matchService: MatchService) {
        this.matchService = matchService;
    }

    public async findMatch(req: Request, res: Response) {
        try {
            const { name, matchId, topic, difficulty } = req.body;
            if (!name || !matchId || !topic || !difficulty) {
                return res.status(400).json({ error: "Invalid request data" });
            }

            const result: boolean = await this.matchService.findMatch(name, matchId, topic, difficulty);

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
            const isCancelled: boolean = await this.matchService.cancelMatch(matchId);
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
