const mongoose = require("mongoose");

const databaseConn = async () => {
  try {
    const user = process.env.MONGODB_USERNAME;
    const password = process.env.MONGODB_PASSWORD;
    const url = process.env.MONGODB_ENDPOINT;

    if (!user || !password || !url) {
      throw new Error(
        "Missing MongoDB connection environment variables (MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_ENDPOINT)."
      );
    }

    const DATABASE_URI = `mongodb+srv://${user}:${password}@${url}/?retryWrites=true&w=majority&appName=PeerPrep`;

    const conn = await mongoose.connect(DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Successfully connected to MongoDB at ${DATABASE_URI}`);

    return conn;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

module.exports = { databaseConn };


