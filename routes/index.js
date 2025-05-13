const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Contacts
 *     description: Operations related to contacts
 *   # You can add more tags here for other resources if needed
 *   # - name: Users
 *   #   description: User management operations
 */

router.use('/contacts', require('./contacts'));

module.exports = router; 