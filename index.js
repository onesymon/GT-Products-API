// index.js
import dotenv from 'dotenv';
dotenv.config(); // This loads the .env file
import express from 'express';
import morgan from 'morgan'; // Import morgan
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import postRoutes from './src/routes/post.routes.js';
import commentRoutes from './src/routes/comment.routes.js';
import userRoutes from './src/routes/user.routes.js';
import authRoutes from './src/routes/auth.routes.js'; // IMPORT
import photoRoutes from "./src/routes/photo.routes.js";
import config from './src/config/index.js';
import { testConnection } from './src/config/db.js'; // Import the test function
import { errorHandler } from './src/middlewares/errorHandler.middleware.js'; // IMPORT
import { globalRateLimiter, authRateLimiter } from './src/config/security.config.js';
import { swaggerSpec } from './src/config/swagger.config.js';

const app = express();

// Security Middlewares (must be applied early)
app.use(helmet()); // Set secure HTTP headers

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow requests from frontend
  credentials: true, // Allow cookies/credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Rate Limiting - Global (applied to all routes)
app.use(globalRateLimiter);

// Middlewares
app.use(morgan('dev')); // Use morgan for logging
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data
app.use('/uploads', express.static('uploads'));

// API Documentation - Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'HelloWorld API Documentation',
}));

// Mount the routes with versioning
app.use('/api/v1/auth', authRateLimiter, authRoutes); // Auth routes with stricter rate limiting
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/photos', photoRoutes);

// Legacy routes (optional - for backward compatibility)
app.use('/api/auth', authRateLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/photos', photoRoutes);

// Error Handler (must be last)
app.use(errorHandler);

// CENTRAL ERROR HANDLER MIDDLEWARE

app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
    testConnection(); // Test the database connection on startup
});