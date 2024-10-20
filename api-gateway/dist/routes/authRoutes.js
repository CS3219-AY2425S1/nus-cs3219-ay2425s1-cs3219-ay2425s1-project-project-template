"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const config_1 = __importDefault(require("../config"));
const router = express_1.default.Router();
const authServiceProxy = (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: config_1.default.services.auth,
    changeOrigin: true,
    pathRewrite: {
        '^/api/auth': '',
    },
});
router.use('/', authServiceProxy);
exports.default = router;
