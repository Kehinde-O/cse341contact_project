const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Fix: Create serverUrl without template literals to avoid path-to-regexp issues
const serverUrl = process.env.RENDER_EXTERNAL_URL || 'http://localhost:' + port;

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS setup - adjust origins as needed for production
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Contact API',
      version: '1.0.0',
      description: 'A comprehensive RESTful API for managing contact information. This API provides full CRUD operations for contacts stored in MongoDB.',
      contact: {
        name: 'API Support',
        email: 'support@contactapi.com'
      }
    },
    servers: [
      {
        url: serverUrl,
        description: 'Main API Server'
      },
    ],
    components: {
      schemas: {
        Contact: {
          type: 'object',
          properties: {
            _id: { 
              type: 'string', 
              description: 'Contact ID (auto-generated by MongoDB)', 
              example: '60564fcb5450ae0015b90570',
              readOnly: true
            },
            firstName: { 
              type: 'string', 
              description: "Contact's first name", 
              example: 'John',
              minLength: 1,
              maxLength: 50
            },
            lastName: { 
              type: 'string', 
              description: "Contact's last name", 
              example: 'Doe',
              minLength: 1,
              maxLength: 50
            },
            email: { 
              type: 'string', 
              format: 'email',
              description: "Contact's email address", 
              example: 'john.doe@example.com'
            },
            favoriteColor: { 
              type: 'string', 
              description: "Contact's favorite color", 
              example: 'Blue',
              maxLength: 30
            },
            birthday: { 
              type: 'string', 
              format: 'date', 
              description: "Contact's birthday in YYYY-MM-DD format", 
              example: '1990-01-15'
            }
          },
          required: ['firstName', 'lastName', 'email']
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Contact not found'
            },
            error: {
              type: 'string',
              description: 'Detailed error information',
              example: 'No contact found with the provided ID'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Contact created successfully'
            },
            contactId: {
              type: 'string',
              description: 'ID of the created/updated contact',
              example: '60564fcb5450ae0015b90570'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './server.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  customSiteTitle: 'Contact API Documentation',
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true,
  }
}));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns a simple message to confirm the API is running
 *     tags: [Health Check]
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: CSE341 Contact API is running
 */
app.get('/', (req, res) => {
  res.send('CSE341 Contact API is running');
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check with server status
 *     description: Returns detailed server health information
 *     tags: [Health Check]
 *     responses:
 *       200:
 *         description: Server health information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                 environment:
 *                   type: string
 *                   example: production
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount routes
app.use('/', require('./routes/index'));

// Handle 404s
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    error: `The requested route ${req.originalUrl} does not exist`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

const start = async () => {
  try {
    // Make sure we have the required environment variables
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️ MONGODB_URI environment variable is not set. Using a placeholder for now.');
      // Setting a console warning but not throwing an error for development purposes
      // In production, you would want to throw an error here
    }

    if (!process.env.DATABASE_NAME) {
      console.warn('⚠️ DATABASE_NAME environment variable is not set. Using "contactsDB" as default.');
      process.env.DATABASE_NAME = 'contactsDB';
    }

    try {
      if (process.env.MONGODB_URI) {
        await connectDB(process.env.MONGODB_URI);
        console.log(`📊 Database connected to MongoDB Atlas!`);
      }
    } catch (dbError) {
      console.error('❌ Database connection error:', dbError.message);
      console.log('📢 The API will start but database operations will fail.');
    }
    
    app.listen(port, () => {
      console.log(`🚀 Server is listening on port ${port}...`);
      console.log(`📚 API Documentation available at: ${serverUrl}/api-docs`);
      console.log(`🏥 Health check available at: ${serverUrl}/health`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

start();