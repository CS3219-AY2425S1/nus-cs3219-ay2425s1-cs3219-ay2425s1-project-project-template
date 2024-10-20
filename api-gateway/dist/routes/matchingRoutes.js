"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const config_1 = __importDefault(require("../config"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
const matchingServiceProxy = (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: config_1.default.services.matching,
    changeOrigin: true,
    pathRewrite: {
        '^/api/matching': '',
    },
});
router.use(authMiddleware_1.authMiddleware);
router.use('/', matchingServiceProxy);
exports.default = router;
