// src/middlewares/validator.middleware.js
import { body, validationResult } from 'express-validator';

export const validatePost = [
    // Title must not be empty and is sanitized
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required.'),

    // Content must not be empty and is sanitized
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required.'),

    // This function handles the result of the validations
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];