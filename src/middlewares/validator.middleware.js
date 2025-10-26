// src/middlewares/validator.middleware.js
import { body, validationResult } from 'express-validator';

export const validatePost = [
    body('title').trim().notEmpty().withMessage('Title is required.'),
    body('content').trim().notEmpty().withMessage('Content is required.'),

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
    // Text must not be empty and is sanitized
    body('text')
        .trim()
        .notEmpty()
        .withMessage('Comment text is required.'),

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

// ADD THIS NEW VALIDATOR
export const validateRegistration = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required.'),
    
    body('email')
        .isEmail()
        .withMessage('A valid email is required.'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long.'),
    
    // This part remains the same for all validators
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    },
];

// ADD VALIDATE LOGIN
export const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('A valid email is required.'),

    body('password')
        .notEmpty()
        .withMessage('Password is required.'),
    
    // This part remains the same for all validators
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    },
];