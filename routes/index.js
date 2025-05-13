const express = require('express');
const router = express.Router();

// Route for /contacts will use routes/contacts.js
router.use('/contacts', require('./contacts'));

module.exports = router; 