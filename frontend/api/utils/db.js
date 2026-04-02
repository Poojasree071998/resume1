import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not defined in environment variables. Falling back to local development URI.');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and serverless invocations.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    console.error('CRITICAL ERROR: MONGODB_URI is not defined in Vercel/Production environment.');
    console.info('To fix: Add MONGODB_URI to your Vercel Project Settings > Environment Variables.');
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      connectTimeoutMS: 10000, // 10 seconds timeout for initial connection
      serverSelectionTimeoutMS: 5000, // 5 seconds to find a server
    };

    console.log('Attempting new MongoDB connection...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connection established ✅');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Clear promise so retry is possible
    console.error('CRITICAL: Failed to connect to MongoDB ❌:', e.message);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
