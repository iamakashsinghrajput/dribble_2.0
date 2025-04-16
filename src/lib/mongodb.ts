import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGO_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI!);

  try {
    await client.connect();
    const dbName = MONGODB_DB || new URL(MONGODB_URI!).pathname.substring(1);
    if (!dbName) {
      throw new Error('Database name not specified in MONGO_URI or MONGODB_DB env variable.');
    }
    const db = client.db(dbName);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    await client.close();
    throw error;
  }
}

export async function getDb(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}
