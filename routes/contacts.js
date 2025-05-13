const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: API for managing contacts
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Retrieve a list of all contacts
 *     tags: [Contacts]
 *     description: Fetches a list of all contacts from the database.
 *     responses:
 *       200:
 *         description: A list of contacts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       500:
 *         description: Internal Server Error or Error fetching all contacts
 */
router.get('/', contactsController.getAllContacts);

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Retrieve a single contact by ID
 *     tags: [Contacts]
 *     description: Fetches a single contact from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the contact to retrieve.
 *         schema:
 *           type: string
 *           example: 60564fcb5450ae0015b90570
 *     responses:
 *       200:
 *         description: A single contact.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid Contact ID format
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal Server Error or Error fetching single contact
 */
router.get('/:id', contactsController.getSingleContact);

module.exports = router; 