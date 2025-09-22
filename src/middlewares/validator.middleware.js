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

    // AuthorId must be a valid integer greater than or equal to 1
    body('authorId')
        .isInt({ min: 1 })
        .withMessage('A valid author ID is required.'),

    // This function handles the result of the validations
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

export const validateComment = [
    // Content must not be empty and is sanitized
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Comment content is required.'),

    // AuthorId must be a valid integer greater than or equal to 1
    body('authorId')
        .isInt({ min: 1 })
        .withMessage('A valid author ID is required.'),

    // This function handles the result of the validations
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];