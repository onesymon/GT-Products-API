// src/routes/auth.routes.js
import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validateRegistration } from '../middlewares/validator.middleware.js';

const router = Router();

// Define the registration endpoint
router.post('/register', validateRegistration, authController.registerUser);

export default router;