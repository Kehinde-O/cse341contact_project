const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
// Determine server URL based on environment
const serverUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`;

app.use(express.json());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Contact API',
      version: '1.0.0',
      description: 'API documentation for the Contact application',
    },
    servers: [
      {
        url: serverUrl, // Use dynamic server URL
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
  res.send('CSE341 Contact API is running'); // Updated root path message
});

app.use('/', require('./routes/index'));

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
      console.log(`Connected to MongoDB Atlas!`);
    });
  } catch (error) {
    console.error('Failed to connect to the database or start the server:', error);
  }
};

start();