"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const matchingRoutes_1 = __importDefault(require("./routes/matchingRoutes"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api', matchingRoutes_1.default);
const PORT = process.env.PORT || "3002";
app.listen(PORT, (err) => {
    if (err) {
        return console.error(err);
    }
    return console.log(`App is running on port ${PORT}`);
});
