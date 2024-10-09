import express, { Application } from "express";
import createRouter from "./routes";
import MatchController from "./controllers/MatchController";
import { initialiseServices } from "./bootstrap";
import { loggerRequestMiddleware, loggerResponseMiddleware } from "./middlewares/loggerMiddleware";

async function main() {
    const app: Application = express();
    const matchController: MatchController = await initialiseServices();

    app.use(express.json());
    app.use(loggerRequestMiddleware);
    app.use(loggerResponseMiddleware);
    app.use('/match', createRouter(matchController));

    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}

main();
