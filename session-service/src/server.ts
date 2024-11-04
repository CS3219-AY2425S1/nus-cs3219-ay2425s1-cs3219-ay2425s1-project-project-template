import express, { Request, Response } from "express";
import { createServer } from "http";
import cors from "cors";
import { WebSocketServer } from "ws";
const setupWSConnection = require("y-websocket/bin/utils").setupWSConnection;

/**
 * CORSConfiguration.
 */
export const allowedOrigins = ["*"];

/**
 * Server INITIALIZATION and CONFIGURATION
 * CORS configuration
 * Request body parsing
 */
const app = express();
app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type",
    credentials: true,
  })
);
app.use(express.json()); //

/**
 * Create an http server
 */
export const httpServer = createServer(app);

/**
 * Create a wss (Web Socket Secure) server
 */
export const wss = new WebSocketServer({ server: httpServer });

function onError(error: any) {
  console.error(error);
}

function onListening() {
  console.log("Listening");
}

httpServer.on("error", onError);
httpServer.on("listening", onListening);

const PORT = process.env.PORT || 4444; // fallback to 4444 if PORT env var is not set

httpServer.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

/**
 * On connection, use the utility file provided by y-websocket.
 */
wss.on("connection", (ws, req) => {
  console.log("wss:connection");
  setupWSConnection(ws, req);
});
