const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log('Using cached DB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Creating new DB connection...');
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => m)
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  console.log('DB connection established');
  return cached.conn;
}

module.exports = connectDB;