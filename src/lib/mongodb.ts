import { MongoClient, ServerApiVersion, Db } from "mongodb";

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is not defined in .env');

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

let database: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (database) return database;

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    
    // Initialize the database
    database = client.db("crisis_corner");
    return database;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}