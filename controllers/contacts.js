const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb'); // For converting string ID to MongoDB ObjectId

// Controller to get all contacts
const getAllContacts = async (req, res) => {
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Get all contacts'
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
  // #swagger.tags = ['Contacts']
  // #swagger.description = 'Get a single contact by ID'
  // #swagger.parameters['id'] = { description: 'Contact ID', required: true }
  try {
    const db = getDb();
    const contactId = req.params.id;

    // Validate the ID format before attempting to create an ObjectId
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid Contact ID format' });
    }

    const objectId = new ObjectId(contactId);
    const result = await db.collection('contacts').find({ _id: objectId }).toArray();

    if (result.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result[0]); // Return the first document found
  } catch (error) {
    console.error('Error fetching single contact:', error);
    res.status(500).json({ message: 'Error fetching single contact', error: error.message });
  }
};

// We can add createContact, updateContact, deleteContact functions here later

module.exports = {
  getAllContacts,
  getSingleContact,
}; 