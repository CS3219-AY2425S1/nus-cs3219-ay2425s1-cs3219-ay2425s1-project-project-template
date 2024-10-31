// db.js
import { MongoClient } from "mongodb"

// Replace this with your actual MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "matchmakingDB"

let db

async function connectToMongoDB() {
  if (db) {
    return db
  }

  try {
    const client = await MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = client.db(DB_NAME)
    console.log("Connected to MongoDB")
    return db
  } catch (err) {
    console.error("Failed to connect to MongoDB", err)
    throw err
  }
}
export { connectToMongoDB, db }
