import mongoose from 'mongoose';
import { env } from './env.js';

let memoryServer = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return { isMemory: Boolean(memoryServer) };
  }

  if (env.NODE_ENV === 'test') {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri());
    console.log('⚡ Connected to isolated in-memory MongoDB for tests.');
    return { isMemory: true };
  }

  if (!env.MONGO_URI || env.MONGO_URI.includes('<username>')) {
    throw new Error('MONGO_URI must be configured with a valid MongoDB connection string.');
  }

  await mongoose.connect(env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log('✅ Connected to MongoDB:', mongoose.connection.host);
  return { isMemory: false };
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};
