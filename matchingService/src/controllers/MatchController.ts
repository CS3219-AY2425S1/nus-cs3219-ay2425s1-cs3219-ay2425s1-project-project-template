import { Request, Response } from "express";
import MatchService from "../services/MatchService";
import logger from "../utils/logger";
import { Difficulty, Topic } from "../QueueService/matchingEnums";

/**
 * MatchController handles the incoming requests related to user matching.
 * This class is responsible for parsing and validating incoming requests and packaging responses.
 */
export default class MatchController {
    private matchService: MatchService;

    constructor(matchService: MatchService) {
        this.matchService = matchService;
    }

    public async findMatch(req: Request, res: Response): Promise<Response> {
        try {
            const { name, matchId, topic, difficulty } = req.body;
            const validationError: string | null = this.validateFindMatchRequest({ name, matchId, topic, difficulty });
            if (validationError) {
                return res.status(400).json({ error: validationError })
            }

            const result: boolean = await this.matchService.findMatch(name, matchId, topic, difficulty);
            
            if (result) {
                return res.json({ success: result });
            } else {
                return res.status(500).json({ error: "Failed to process match request" });
            }
        } catch (error) {
            console.error("Error handling match request:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    public async cancelMatch(req: Request, res: Response): Promise<Response> {
        const matchId: string = req.query.matchId as string;

        if (!matchId) {
            return res.status(400).json({ error: "matchId is required" });
        }

        try {
            const isCancelled: boolean = await this.matchService.cancelMatch(matchId);
            if (isCancelled) {
                return res.json({ success: true });
            } else {
                return res.status(404).json({ error: "Match not found or already processed" });
            }
        } catch (error) {
            console.error("Error cancelling match:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    private validateFindMatchRequest(data: { name: string; matchId: string; topic: string; difficulty: string }): string | null {
        const { name, matchId, topic, difficulty } = data;
        if (!name || !matchId || !topic || !difficulty) {
            return "Invalid request data. All fields are required.";
        }

        if (!Object.values(Difficulty).includes(difficulty as Difficulty)) {
            return "Invalid difficulty level provided!";
        }

        if (!Object.values(Topic).includes(topic as Topic)) {
            return "Invalid topic provided!";
        }
        return null;
    }
}
