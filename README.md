# Contacts API

A RESTful API for managing contact information built with Node.js, Express, and MongoDB.

## Features

- **Full CRUD Operations**: Create, Read, Update, and Delete contacts
- **MongoDB Integration**: Secure database storage using MongoDB Atlas
- **Comprehensive API Documentation**: Interactive Swagger UI documentation
- **Input Validation**: Email format validation and required field checks
- **Error Handling**: Proper HTTP status codes and error messages
- **Professional Structure**: Organized with MVC architecture

## Contact Schema

Each contact contains the following fields:

- `firstName` (string, required): Contact's first name
- `lastName` (string, required): Contact's last name  
- `email` (string, required): Contact's email address (validated format)
- `favoriteColor` (string, optional): Contact's favorite color
- `birthday` (string, optional): Contact's birthday in YYYY-MM-DD format

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd contact
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=contactsDB

# Server Configuration
PORT=3000

# Render Configuration (for deployment)
RENDER_EXTERNAL_URL=https://your-app-name.onrender.com
```

**Replace the MongoDB URI with your actual MongoDB Atlas connection string.**

### 4. Seed the Database (Optional)

To populate the database with sample data:

```bash
node seed/contactSeed.js
```

### 5. Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contacts` | Get all contacts |
| GET | `/contacts/:id` | Get a single contact by ID |
| POST | `/contacts` | Create a new contact |
| PUT | `/contacts/:id` | Update an existing contact |
| DELETE | `/contacts/:id` | Delete a contact |

## API Documentation

Once the server is running, access the interactive Swagger documentation at:

```
http://localhost:3000/api-docs
```

The Swagger UI provides:
- Complete API endpoint documentation
- Request/response examples
- Interactive testing interface
- Schema definitions

## Example API Usage

### Create a Contact

```bash
POST /contacts
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "favoriteColor": "Blue",
  "birthday": "1990-01-15"
}
```

### Get All Contacts

```bash
GET /contacts
```

### Update a Contact

```bash
PUT /contacts/60564fcb5450ae0015b90570
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "favoriteColor": "Red",
  "birthday": "1990-01-15"
}
```

### Delete a Contact

```bash
DELETE /contacts/60564fcb5450ae0015b90570
```

## Deployment to Render

### 1. Prepare for Deployment

- Ensure all environment variables are properly configured
- Test locally to verify everything works
- Commit all changes to your Git repository

### 2. Deploy to Render

1. Connect your GitHub repository to Render
2. Set up the following environment variables in Render:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `DATABASE_NAME`: Your database name (e.g., "contactsDB")
   - `RENDER_EXTERNAL_URL`: Your Render app URL

3. Render will automatically build and deploy your application

### 3. Verify Deployment

Once deployed, test your API endpoints and visit the Swagger documentation:

```
https://your-app-name.onrender.com/api-docs
```

## Project Structure

```
contact/
├── controllers/
│   └── contacts.js          # Business logic for contact operations
├── db/
│   └── connect.js           # MongoDB connection configuration
├── routes/
│   ├── index.js             # Main route handler
│   └── contacts.js          # Contact-specific routes with Swagger docs
├── seed/
│   └── contactSeed.js       # Database seeding script
├── .env                     # Environment variables (not in git)
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies and scripts
├── server.js               # Main application entry point
└── README.md               # This file
```

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid data format, missing required fields
- **404 Not Found**: Contact not found
- **500 Internal Server Error**: Database or server errors

All errors return JSON responses with descriptive error messages.

## Validation

- **Email Format**: Validates proper email format using regex
- **Required Fields**: firstName, lastName, and email are required
- **MongoDB ObjectId**: Validates ID format before database operations

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Swagger**: API documentation
- **dotenv**: Environment variable management

## License

This project is for educational purposes as part of CSE341 coursework. 