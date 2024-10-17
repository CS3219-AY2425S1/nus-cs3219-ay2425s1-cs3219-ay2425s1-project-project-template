import express from 'express';
import router from "./routes/matching-route";

const app = express();

app.use(express.json())
app.use(router);

app.listen(3002, () => {
    console.log("Server started on port 3002");
})