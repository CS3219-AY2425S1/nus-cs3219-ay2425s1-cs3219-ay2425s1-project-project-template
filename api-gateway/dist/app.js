"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const config_1 = __importDefault(require("./config"));
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)(config_1.default.corsOptions));
app.use(express_1.default.json());
// Logging middleware
app.use((req, res, next) => {
    logger_1.default.info(`Incoming request: ${req.method} ${req.originalUrl}`);
    next();
});
// Routes
app.use('/api', routes_1.default);
// Error handling
app.use(errorHandler_1.errorHandler);
// Start server
const startServer = () => {
    app.listen(config_1.default.port, () => {
        logger_1.default.info(`API Gateway running on port ${config_1.default.port}`);
    });
};
if (require.main === module) {
    startServer();
}
exports.default = app;
