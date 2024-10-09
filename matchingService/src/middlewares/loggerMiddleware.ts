import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const { method, url } = req;
    logger.info(`Incoming request: ${method} ${url}`);
    next();
};

export default loggerMiddleware;
