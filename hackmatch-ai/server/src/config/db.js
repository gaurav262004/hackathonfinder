import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI?.trim();

  if (mongoUri) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });

      console.log(`✅ MongoDB Connected (real MongoDB) on ${conn.connection.name || "database"}`);
      return conn;
    } catch (error) {
      console.error(`❌ MongoDB connection failed: ${error.message}`);
      console.log(`⚠️ Falling back to in-memory MongoDB`);
    }
  } else {
    console.log("⚠️ MONGODB_URI not set, using in-memory MongoDB fallback");
  }

  try {
    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();

    const conn = await mongoose.connect(memoryUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected (In-Memory): ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log(`⚠️ Running in offline mode - some features may not work`);
    return null;
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  if (mongoServer) {
    await mongoServer.stop();
  }
  process.exit(0);
});

export default connectDB;
