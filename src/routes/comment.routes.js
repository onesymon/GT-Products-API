// src/routes/comment.routes.js
import { Router } from 'express';
import * as commentController from '../controllers/comment.controllers.js';

const router = Router();

// Route for GET /comments
router.get('/', commentController.getAllComments);

export default router;