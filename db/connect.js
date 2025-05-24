const { MongoClient } = require('mongodb');

let _db;

const connectDB = async (uri) => {
  if (_db) {
    console.log('Already connected to the database!');
    return _db;
  }
  try {
    const client = await MongoClient.connect(uri);
    _db = client.db(process.env.DATABASE_NAME);
    return _db;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
};

const getDb = () => {
  if (!_db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return _db;
};

module.exports = {
  connectDB,
  getDb,
}; 