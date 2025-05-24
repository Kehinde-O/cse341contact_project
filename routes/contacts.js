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

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     description: Creates a new contact in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Contact's first name
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: Contact's last name
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Contact's email address
 *                 example: john.doe@example.com
 *               favoriteColor:
 *                 type: string
 *                 description: Contact's favorite color
 *                 example: Blue
 *               birthday:
 *                 type: string
 *                 format: date
 *                 description: Contact's birthday (YYYY-MM-DD)
 *                 example: 1990-01-15
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contact created successfully
 *                 contactId:
 *                   type: string
 *                   example: 60564fcb5450ae0015b90570
 *       400:
 *         description: Bad request - missing required fields or invalid email format
 *       500:
 *         description: Internal Server Error
 */
router.post('/', contactsController.createContact);

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update an existing contact
 *     tags: [Contacts]
 *     description: Updates an existing contact in the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the contact to update.
 *         schema:
 *           type: string
 *           example: 60564fcb5450ae0015b90570
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Contact's first name
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: Contact's last name
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Contact's email address
 *                 example: john.doe@example.com
 *               favoriteColor:
 *                 type: string
 *                 description: Contact's favorite color
 *                 example: Blue
 *               birthday:
 *                 type: string
 *                 format: date
 *                 description: Contact's birthday (YYYY-MM-DD)
 *                 example: 1990-01-15
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contact updated successfully
 *       400:
 *         description: Bad request - Invalid ID format, missing required fields, or invalid email format
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/:id', contactsController.updateContact);

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     description: Deletes a contact from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the contact to delete.
 *         schema:
 *           type: string
 *           example: 60564fcb5450ae0015b90570
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contact deleted successfully
 *       400:
 *         description: Invalid Contact ID format
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', contactsController.deleteContact);

module.exports = router; 