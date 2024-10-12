import { createClient } from "redis";
import express from "express";

const app = express();
const port = 3000;

const client = createClient({
  password: "Wn0eVNObgsDyQkJVKcTJfpHogb7VDZ5s",
  socket: {
    host: "redis-18807.c337.australia-southeast1-1.gce.redns.redis-cloud.com",
    port: 18807,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
