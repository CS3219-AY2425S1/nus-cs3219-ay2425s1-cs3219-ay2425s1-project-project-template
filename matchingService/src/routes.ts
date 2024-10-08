import express, { Router } from "express";
import MatchController from "./controllers/MatchController";

export default function createRouter(controller: MatchController): Router {
    const router: Router = express.Router();

    router.post("/findMatch", (req, res) => controller.findMatch(req, res));
    router.delete("/cancelMatch", (req, res) => controller.cancelMatch(req, res));

    return router;
}
