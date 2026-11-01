import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'skillsync_logs';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToMongoDB(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getCollection(collectionName: string) {
  const { db } = await connectToMongoDB();
  return db.collection(collectionName);
}

// Activity logging helper
export async function logActivity(
  userId: number,
  action: string,
  entityType: string,
  entityId: number,
  details: Record<string, unknown> = {}
) {
  try {
    const collection = await getCollection('activity_logs');
    await collection.insertOne({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Failed to log activity to MongoDB:', error);
  }
}
