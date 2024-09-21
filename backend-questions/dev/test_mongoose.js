import mongoose from 'mongoose';
import 'dotenv/config';

const mongoDB = process.env.MONGO_URI;
console.log(mongoDB);
const Admin = mongoose.mongo.Admin;

mongoose.connect(mongoDB);

main().catch(err => console.log(err));

async function main() {
  try {
    await mongoose.connect(mongoDB);
    console.log("yay");
    const { databases } = await mongoose.connection.listDatabases();
    console.log(databases);
    console.log("the end");
    
  } catch (err) {
    console.log(err);
  }
}

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));