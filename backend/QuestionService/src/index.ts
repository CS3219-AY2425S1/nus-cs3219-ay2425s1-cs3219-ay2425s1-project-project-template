import express from "express";
import mongoose from "mongoose";
import questionRoute from "./routes/questionRoute";
import 'dotenv/config';



const app = express();

app.use(express.json());

app.use("/api/question", questionRoute);

const mongoURI = process.env.MONGOURI;

mongoose.connect(mongoURI!)
    .then(() => {
        app.listen(4000, () => {
            console.log("Listening on port 4000.")
        })
    })
    .catch((err) => {
        console.log(err);
    });



