import { MongoClient } from "mongodb";
import dotenv from 'dotenv'
dotenv.config()

// Replace the uri string with your connection string.
const uri = process.env.MONGO_URI;
console.log("URI = ", uri);


const client = new MongoClient(uri);

async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

listDatabases(client);

async function run() {
  try {
    await client.connect();

    console.log("client connected!");

    const database = client.db('sample_mflix');
    const movies = database.collection('movies');

    console.log(movies);

    // Query for a movie that has the title 'Back to the Future'
    const query = { title: 'Back to the Future' };
    const movie = await movies.findOne(query);

    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
// run().catch(console.dir);