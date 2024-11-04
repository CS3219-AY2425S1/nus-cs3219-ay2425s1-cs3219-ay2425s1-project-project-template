import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017/';
const dbName = 'code-editor';

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const sessions = await db.collection('sessions').find({}).toArray();
    return NextResponse.json(sessions, { status: 200 });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}