const mongoose = require('mongoose');

// Vercel serverless functions can be invoked many times on "warm" instances.
// Without caching, every invocation would open a brand new connection to
// Atlas and quickly exhaust the connection limit. This caches the connection
// (and the in-flight connection promise) on the global object so it is
// reused across invocations of the same warm instance.
let cached = global._mongooseCache;
if (!cached) {
    cached = global._mongooseCache = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error(
                'Missing MONGODB_URI environment variable. Set it to your MongoDB Atlas connection string.'
            );
        }

        cached.promise = mongoose
            .connect(uri, {
                dbName: process.env.MONGODB_DB || 'login_page',
            })
            .then((mongooseInstance) => mongooseInstance);
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    return cached.conn;
}

module.exports = connectDB;
