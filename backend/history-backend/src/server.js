import http from "http";
import index from "./index.js";
import "dotenv/config";
import { connect } from "mongoose";

const port = process.env.PORT || 3004;

async function connectToDB() {
  let mongoDBUri =
    process.env.ENV === "PROD"
      ? process.env.DB_CLOUD_URI
      : process.env.DB_LOCAL_URI;

  await connect(mongoDBUri);
}

const server = http.createServer(index);

await connectToDB().then(() => {
  console.log("MongoDB Connected!");

  server.listen(port);
  console.log("User server is listening on http://localhost:" + port);
}).catch((err) => {
  console.error("Failed to connect to DB");
  console.error(err);
});

