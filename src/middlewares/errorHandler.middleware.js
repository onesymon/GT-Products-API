// src/middlewares/errorHandler.middleware.js
import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Internal Server Error";

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // You can add more specific error checks here if needed
    // for things like database unique constraint errors, etc.

    return res.status(statusCode).json({
        success: false,
        message: message,
    });
};