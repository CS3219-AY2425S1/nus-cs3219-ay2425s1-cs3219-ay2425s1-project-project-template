import { NextFunction, Request, Response } from "express";
import MatchService from "../services/MatchService";
import RequestValidator from "../validators/RequestValidator";

/**
 * MatchController handles the incoming requests related to user matching.
 * This class is responsible for parsing and validating incoming requests and packaging responses.
 */
export default class MatchController {
    private matchService: MatchService;

    constructor(matchService: MatchService) {
        this.matchService = matchService;
    }

    public async findMatch(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, matchId, topic, difficulty } = req.body;
            RequestValidator.validateFindMatchRequest({ name, matchId, topic, difficulty });

            const result: boolean = await this.matchService.findMatch(name, matchId, topic, difficulty);
            
            if (result) {
                return res.json({ success: result });
            } else {
                return res.status(500).json({ error: "Failed to process match request" });
            }
        } catch (error) {
            next(error);
        }
    }

    public async cancelMatch(req: Request, res: Response, next: NextFunction) {
        const matchId: string = req.query.matchId as string;

        try {
            RequestValidator.validateCancelMatchRequest(matchId);
            const isCancelled: boolean = await this.matchService.cancelMatch(matchId);
            if (isCancelled) {
                return res.json({ success: true });
            } else {
                return res.status(404).json({ error: "Match not found or already processed" });
            }
        } catch (error) {
            next(error);
        }
    }
}
