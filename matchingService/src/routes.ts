import express, { Router } from "express";
import MatchController from "./controllers/matchController";
import { QueueService } from ".";

export default function createRouter(amqpService: QueueService): Router {
    const router: Router = express.Router();
    const matchController = new MatchController(amqpService);

    router.post("/findMatch", (req, res) => matchController.findMatch(req, res));
    router.delete("/cancelMatch", (req, res) => matchController.cancelMatch(req, res));

    return router;
}
