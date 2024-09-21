import Question from "./Question.js";
import "dotenv/config";
import { connect } from "mongoose";

export async function connectToDB() {
  let mongoDBUri = process.env.MONGO_URI;

  await connect(mongoDBUri);
}