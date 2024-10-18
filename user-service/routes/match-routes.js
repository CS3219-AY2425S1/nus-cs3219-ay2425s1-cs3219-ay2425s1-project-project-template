import express from "express";

import { verifyAccessToken } from "../middleware/basic-access-control.js";
import { createChannel, receive } from "../rabbit/rabbit.js";
import { requestMatch } from "../controller/match-controller.js"


const router = express.Router();
let channel = null;

// Wrapping the channel creation in an IIFE (Immediately Invoked Function Expression) 
// so that it's awaited properly before use.
(async () => {
    channel = await createChannel(); // Wait until channel is created
    if (channel) {
        // If the channel is created successfully, call receive
        receive(channel);
    } else {
        console.error("Failed to create RabbitMQ channel.");
    }
})();

router.post("/match-request", verifyAccessToken, async (req, res, next) => {
    if (!channel) {
        return res.status(500).json({ message: "RabbitMQ connection issue. Try again later." });
    }
    await requestMatch(channel)(req, res, next);
});

export default router;
