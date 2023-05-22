const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb+srv://RyanAlfas:1234@musti.qhw9nmw.mongodb.net/?retryWrites=true&w=majority';

// Database Name
const dbName = 'proje';

// Create a new MongoClient
const client = new MongoClient(url);

// Function to connect to MongoDB
async function connect() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB');

    // Access the database
    const db = client.db(dbName);
    return db;
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
}

module.exports = connect;
