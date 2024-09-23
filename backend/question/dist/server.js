"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionRoutes_1 = __importDefault(require("./routes/questionRoutes"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api', questionRoutes_1.default);
const PORT = process.env.PORT || "3003";
app.listen(PORT, (err) => {
    if (err) {
        return console.error(err);
    }
    return console.log(`App is running on port ${PORT}`);
});
