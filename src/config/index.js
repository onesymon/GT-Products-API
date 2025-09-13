// src/config/index.js
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    // Add more configuration values as needed
    // database: {
    //     host: process.env.DB_HOST || 'localhost',
    //     port: process.env.DB_PORT || 5432,
    //     name: process.env.DB_NAME || 'myapp',
    //     user: process.env.DB_USER || 'postgres',
    //     password: process.env.DB_PASSWORD || ''
    // },
    // api: {
    //     version: process.env.API_VERSION || 'v1',
    //     baseUrl: process.env.API_BASE_URL || 'http://localhost:3000'
    // }
};

export default config;
