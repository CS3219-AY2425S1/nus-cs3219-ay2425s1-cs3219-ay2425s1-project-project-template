"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionRoutes_1 = __importDefault(require("./questionRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const matchingRoutes_1 = __importDefault(require("./matchingRoutes"));
const router = express_1.default.Router();
router.use('/questions', questionRoutes_1.default);
router.use('/auth', authRoutes_1.default);
router.use('/matching', matchingRoutes_1.default);
exports.default = router;
