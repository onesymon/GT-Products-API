// index.js
import dotenv from 'dotenv';
dotenv.config(); // This loads the .env file
import express from 'express';
import morgan from 'morgan'; // Import morgan
import postRoutes from './src/routes/post.routes.js';
import commentRoutes from './src/routes/comment.routes.js';
import userRoutes from './src/routes/user.routes.js';
import authRoutes from './src/routes/auth.routes.js'; // IMPORT
import photoRoutes from "./src/routes/photo.routes.js";
import config from './src/config/index.js';
import { testConnection } from './src/config/db.js'; // Import the test function
import { errorHandler } from './src/middlewares/errorHandler.middleware.js'; // IMPORT

const app = express();


// Middlewares
app.use(morgan('dev')); // Use morgan for logging
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// Mount the routes
app.use('/api/auth', authRoutes); // MOUNT
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/photos', photoRoutes); // Don't forget to import and mount
app.use(errorHandler);

// CENTRAL ERROR HANDLER MIDDLEWARE

app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
    testConnection(); // Test the database connection on startup
});