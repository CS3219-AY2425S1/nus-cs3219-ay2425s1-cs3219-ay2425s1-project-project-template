"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const amqplib_1 = __importDefault(require("amqplib"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
// app.use(express.urlencoded({ extended: true }))
const EXCHANGE = "topics_exchange";
var connection, channel;
const connectRabbitMQ = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const amqpServer = process.env.AMQP_SERVER;
        console.log(amqpServer);
        connection = yield amqplib_1.default.connect(amqpServer);
        channel = yield connection.createChannel();
        yield channel.assertExchange(EXCHANGE, "topic", { durable: false });
        console.log("Connected to RabbitMQ");
    }
    catch (err) {
        console.error(err);
    }
});
connectRabbitMQ();
const addDataToExchange = (userData, key) => __awaiter(void 0, void 0, void 0, function* () {
    yield channel.publish(EXCHANGE, key, Buffer.from(JSON.stringify(userData)));
});
const pullDataFromExchange = () => __awaiter(void 0, void 0, void 0, function* () {
    yield channel;
});
// Publish message to exchange
app.post("/", (req, res) => {
    try {
        const { userData, key } = req.body; //key-value pair of userData will be <difficulty>.<topic(s)> 
        addDataToExchange(userData, key);
        console.log("Data Sent: ", req.body);
        res.json({ message: "Data Sent" });
    }
    catch (e) {
        console.error("Message incorrectly sent out");
        console.error(e);
        res.json({ message: "Data failed to send" });
    }
});
app.get("/", (req, res, next) => {
    console.log("Hello World");
    res.json({
        message: "This is message queue."
    });
});
app.use((req, res, next) => {
    const error = new Error("Route Not Found");
    res.
        next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
app.listen(3002, () => {
    console.log("Publisher running.");
});
