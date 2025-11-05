import mongoose from 'mongoose';

// Define the structure of our cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global namespace to include our mongoose cache
declare global {
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

// Throw an error if the connection string is not defined
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Initialize the cache object
// In development, use a global variable to preserve the connection across hot reloads
// In production, this will be initialized fresh on each cold start
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes a connection to MongoDB using Mongoose
 * Reuses existing connections to prevent connection exhaustion
 * @returns Promise that resolves to the Mongoose instance
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Return pending connection promise if one exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose buffering to fail fast if connection is not established
    };

    // Create new connection promise
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    // Wait for the connection to be established
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset promise on error to allow retry
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
