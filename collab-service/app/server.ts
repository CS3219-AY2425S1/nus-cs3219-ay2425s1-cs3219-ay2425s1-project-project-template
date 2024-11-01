import { connectToMongo } from "./model/repository";
import http from "http";
import { index } from "./index.ts";
const PORT = process.env.PORT || 5000;
const server = http.createServer(index);