import http from "http";
import index from "./index.js";
import "dotenv/config";
import dotenv from "dotenv";
import { connectToDB } from "./model/repository.js";

const port = process.env.PORT || 3001;

// Load  environment variables from config .env file
const result = dotenv.config({ path: '../config/.env' });
if (result.error) {
  throw new Error("Failed to load .env file");
}

const server = http.createServer(index);

await connectToDB().then(() => {
  console.log("MongoDB Connected!");

  server.listen(port);
  console.log("User service server listening on http://localhost:" + port);
}).catch((err) => {
  console.error("Failed to connect to DB");
  console.error(err);
});

