import express, { Router } from "express";
import MatchController from "./controllers/MatchController";
import { QueueService } from ".";
import MatchService from "./services/MatchService";

export default function createRouter(amqpService: QueueService): Router {
    const router: Router = express.Router();
    const matchService = new MatchService(amqpService);
    const matchController = new MatchController(matchService);

    router.post("/findMatch", (req, res) => matchController.findMatch(req, res));
    router.delete("/cancelMatch", (req, res) => matchController.cancelMatch(req, res));

    return router;
}
