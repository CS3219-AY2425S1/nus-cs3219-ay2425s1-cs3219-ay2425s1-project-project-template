"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("../utils/logger"));
const router = express_1.default.Router();
const questionServiceProxy = (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: config_1.default.services.question,
    changeOrigin: true,
    pathRewrite: {
        '^/api/questions': '/api/v1/questions',
    },
});
router.use((req, res, next) => {
    logger_1.default.info(`Question route accessed: ${req.method} ${req.originalUrl}`);
    next();
});
// Log the proxied request path
router.use((req, res, next) => {
    logger_1.default.info(`Proxying request to: ${req.url}`);
    next();
});
// router.use(authMiddleware as express.RequestHandler);
router.use('/api/questions', questionServiceProxy);
exports.default = router;
