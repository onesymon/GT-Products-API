// index.js
import express from 'express';
import morgan from 'morgan'; // Import morgan
import postRoutes from './src/routes/post.routes.js';
import commentRoutes from './src/routes/comment.routes.js';
import config from './src/config/index.js';

const app = express();


// Middlewares
app.use(morgan('dev')); // Use morgan for logging
app.use(express.json());



// Mount the post routes
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);


app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
});