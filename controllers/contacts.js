const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb'); // For converting string ID to MongoDB ObjectId

// Controller to get all contacts
const getAllContacts = async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('contacts').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching all contacts:', error);
    res.status(500).json({ message: 'Error fetching all contacts', error: error.message });
  }
};

// Controller to get a single contact by ID
const getSingleContact = async (req, res) => {
  try {
    const db = getDb();
    const contactId = req.params.id;

    // Check if the ID is a valid MongoDB ObjectId before querying
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid Contact ID format' });
    }

    const objectId = new ObjectId(contactId);
    const result = await db.collection('contacts').find({ _id: objectId }).toArray();

    if (result.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result[0]);
  } catch (error) {
    console.error('Error fetching single contact:', error);
    res.status(500).json({ message: 'Error fetching single contact', error: error.message });
  }
};

// Controller to create a new contact
const createContact = async (req, res) => {
  try {
    const db = getDb();
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    // Basic validation for required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ 
        message: 'firstName, lastName, and email are required fields' 
      });
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const contact = {
      firstName,
      lastName,
      email,
      favoriteColor: favoriteColor || '',
      birthday: birthday || ''
    };

    const result = await db.collection('contacts').insertOne(contact);
    
    if (result.acknowledged) {
      res.status(201).json({ 
        message: 'Contact created successfully',
        contactId: result.insertedId 
      });
    } else {
      res.status(500).json({ message: 'Failed to create contact' });
    }
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: 'Error creating contact', error: error.message });
  }
};

// Controller to update an existing contact
const updateContact = async (req, res) => {
  try {
    const db = getDb();
    const contactId = req.params.id;
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid Contact ID format' });
    }

    // Same validation as create
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ 
        message: 'firstName, lastName, and email are required fields' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const objectId = new ObjectId(contactId);
    
    const updateData = {
      firstName,
      lastName,
      email,
      favoriteColor: favoriteColor || '',
      birthday: birthday || ''
    };

    const result = await db.collection('contacts').updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Contact updated successfully' });
    } else {
      res.status(500).json({ message: 'Failed to update contact' });
    }
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: 'Error updating contact', error: error.message });
  }
};

// Controller to delete a contact
const deleteContact = async (req, res) => {
  try {
    const db = getDb();
    const contactId = req.params.id;

    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid Contact ID format' });
    }

    const objectId = new ObjectId(contactId);
    const result = await db.collection('contacts').deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Error deleting contact', error: error.message });
  }
};

module.exports = {
  getAllContacts,
  getSingleContact,
  createContact,
  updateContact,
  deleteContact,
};