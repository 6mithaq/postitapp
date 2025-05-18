import { Pool, neonConfig } from './neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "./shared/schema";

//neonConfig.webSocketConstructor = ws;

//if (!process.env.DATABASE_URL) {
  //throw new Error(
    //"DATABASE_URL must be set. Did you forget to provision a database?",
  //);
//}

//export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
//export const db = drizzle(pool, { schema });

import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
};