// src/middlewares/errorHandler.middleware.js
import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // If the error is an instance of our custom ApiError, we trust its values
    if (!(err instanceof ApiError)) {
        // For unexpected errors, log them for debugging
        console.error(err);

        // In a production environment, you wouldn't want to send
        // potentially sensitive error details to the client.
        if (process.env.NODE_ENV === 'production') {
            message = "Something went wrong!";
        }
    }

    const response = {
        success: false,
        message: message,
    };

    // Only include the stack trace in development mode
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};