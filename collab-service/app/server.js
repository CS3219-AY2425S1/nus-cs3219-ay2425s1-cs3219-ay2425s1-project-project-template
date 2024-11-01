import { connectToMongo } from "./model/repository.js";
import http from "http";
import index from "./index.js";
const PORT = process.env.PORT || 5000;
const server = http.createServer(index);