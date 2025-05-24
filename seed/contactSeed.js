const dotenv = require('dotenv');
const { connectDB, getDb } = require('../db/connect');

dotenv.config();

const sampleContacts = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    favoriteColor: 'Blue',
    birthday: '1990-01-15',
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    favoriteColor: 'Green',
    birthday: '1985-05-22',
  },
  {
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    favoriteColor: 'Red',
    birthday: '1992-09-10',
  },
  {
    firstName: 'Bob',
    lastName: 'Wilson',
    email: 'bob.wilson@example.com',
    favoriteColor: 'Yellow',
    birthday: '1988-07-03',
  },
  {
    firstName: 'Sarah',
    lastName: 'Davis',
    email: 'sarah.davis@example.com',
    favoriteColor: 'Purple',
    birthday: '1993-12-28',
  },
];

const seedContacts = async () => {
  let client;
  try {
    console.log('Connecting to database for seeding...');
    client = await connectDB(process.env.MONGODB_URI);
    const db = getDb();
    const contactsCollection = db.collection('contacts');

    console.log('Clearing existing contacts...');
    await contactsCollection.deleteMany({});

    console.log('Inserting sample contacts...');
    const result = await contactsCollection.insertMany(sampleContacts);
    console.log(`${result.insertedCount} contacts were successfully inserted.`);

  } catch (error) {
    console.error('Error during contact seeding:', error);
  } finally {
    if (client) {
      console.log('Closing database connection...');
      await client.close();
      console.log('Database connection closed.');
    }
  }
};

seedContacts(); 