// src/routes/comment.routes.js
import { Router } from 'express';
import * as commentController from '../controllers/comment.controllers.js';
import { validateComment } from '../middlewares/validator.middleware.js';

const router = Router();

// Comment Routes
router.get('/', commentController.getAllComments);
router.post('/', validateComment, commentController.createCommentForPost);

export default router;