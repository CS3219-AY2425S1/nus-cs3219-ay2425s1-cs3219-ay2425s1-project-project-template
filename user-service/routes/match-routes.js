import express from "express";

import { verifyAccessToken } from "../middleware/basic-access-control.js";
import { createChannel, receive } from "../rabbit/rabbit.js";
import { requestMatch } from "../controller/match-controller.js"


const router = express.Router();
let channel = null;

router.post("/match-request", verifyAccessToken, async (req, res, next) => {
    if (!channel) {
        // Create RabbitMQ channel
        channel = await createChannel();
        if (channel) {
            console.log("here are the io: ", req.io)
            receive(channel, req.io); // Pass `io` to the `receive` function for socket handling
        } else {
            return res.status(500).json({ message: "RabbitMQ connection issue. Try again later." });
        }
    }

    await requestMatch(channel)(req, res, next);
});

export default router;
