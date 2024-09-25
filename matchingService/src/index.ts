import express, { Application, Request, Response } from "express";
import Service from "./QueueService/Service";
import MatchRequest from "./models/MatchRequest";

interface QueueService {
    sendMessage(matchRequest: MatchRequest): Promise<boolean>;
    cancelMatchRequest(matchId: string): Promise<boolean>;
}

async function main() {
    var amqpService: QueueService = await Service.of(process.env.RABBITMQ_URL || "amqp://localhost:5672", "gateway", "responseGateway");
    const app: Application = express();
    app.use(express.json());

    app.post("/findMatch", async (req: Request, res: Response) => {
        try {
            const { name, matchId, topic, difficulty } = req.body;
            if (!name || !matchId || !topic || !difficulty) {
                return res.status(400).json({ error: "Invalid request data" });
            }

            const matchRequest = new MatchRequest(name, matchId, topic, difficulty);

            const result: boolean = await amqpService.sendMessage(matchRequest);

            if (result) {
                res.json({ success: result });
            } else {
                res.status(500).json({ error: "Failed to process match request" });
            }
        } catch (error) {
            console.error("Error handling match request:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    app.delete("/cancelMatch", async (req: Request, res: Response) => {
        const matchId: string = req.query.matchId as string;
        const isCancelled: boolean = await amqpService.cancelMatchRequest(matchId);
        if (isCancelled) {
            res.json({ success: true });
        } else {
            res.status(404).json({ error: "Match not found or already processed" });
        }
    })

    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}

main();