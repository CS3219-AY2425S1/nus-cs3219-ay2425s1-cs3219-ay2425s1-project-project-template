import { createClient } from "redis";
import express from "express";
import Queue from "bull";
import { createBullBoard } from "@bull-board/api";
import { ExpressAdapter } from "@bull-board/express";
import { BullAdapter } from "@bull-board/api/bullAdapter.js";

const app = express();
const port = 3000;

const matchingQueue = new Queue("matching", "redis://127.0.0.1:6379");

const job = await matchingQueue.add({ foo: "bar" });

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullAdapter(matchingQueue)],
  serverAdapter: serverAdapter,
});

// const client = createClient({
//   password: "Wn0eVNObgsDyQkJVKcTJfpHogb7VDZ5s",
//   socket: {
//     host: "redis-18807.c337.australia-southeast1-1.gce.redns.redis-cloud.com",
//     port: 18807,
//   },
// });

// client.on("error", (err) => console.log("Redis Client Error", err));

// await client.connect();

app.use("/admin/queues", serverAdapter.getRouter());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
