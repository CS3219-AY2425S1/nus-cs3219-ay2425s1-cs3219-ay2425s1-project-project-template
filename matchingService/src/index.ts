import express, { Application } from "express";
import createRouter from "./routes";
import MatchController from "./controllers/MatchController";
import { initialiseServices } from "./bootstrap";
import { loggerRequestMiddleware, loggerResponseMiddleware } from "./middlewares/loggerMiddleware";
import logger from "./utils/logger";

async function main() {
    const app: Application = express();
    const matchController: MatchController = await initialiseServices();

    app.use(express.json());
    app.use(loggerRequestMiddleware);
    app.use(loggerResponseMiddleware);
    app.use('/match', createRouter(matchController));

    app.listen(3000, () => {
        logger.info("Server is running on port 3000");
    });
}

main();
