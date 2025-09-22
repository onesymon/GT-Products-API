// src/routes/user.routes.js
import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';

const router = Router();

// User Routes
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

export default router;
