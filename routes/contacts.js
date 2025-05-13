const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts'); // We'll create this controller next

// GET all contacts (maps to /contacts/)
router.get('/', contactsController.getAllContacts);

// GET a single contact by ID (maps to /contacts/:id)
router.get('/:id', contactsController.getSingleContact);

// We can add POST, PUT, DELETE routes here later

module.exports = router; 