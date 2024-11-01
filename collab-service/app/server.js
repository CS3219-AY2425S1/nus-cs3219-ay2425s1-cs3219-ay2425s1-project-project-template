import { connectToMongo } from "./model/repository.js";
import http from "http";
import index from "./index.js";
const PORT = process.env.PORT || 5000;
const server = http.createServer(index);

connectToMongo().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});