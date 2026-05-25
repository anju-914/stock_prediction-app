import mongoose from "mongoose";
import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI must be set within .env");
}

const globalWithMongoose = global as typeof globalThis & {
    mongooseCache?: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
};

let cached = globalWithMongoose.mongooseCache;

if (!cached) {
    cached = globalWithMongoose.mongooseCache = {
        conn: null,
        promise: null,
    };
}

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (err) {
        cached.promise = null;
        throw err;
    }
};