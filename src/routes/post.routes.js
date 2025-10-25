// src/routes/post.routes.js
import { Router } from 'express';
import * as postController from '../controllers/post.controller.js';
// *** IMPORT THE COMMENT CONTROLLER ***
import * as commentController from '../controllers/comment.controllers.js';
import { validatePost, validateComment } from '../middlewares/validator.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
 

const router = Router();

// --- Post Routes ---
router.get('/', postController.getAllPosts);
router.post('/', authMiddleware, validatePost, postController.createPost);
router.get('/:id', postController.getPostById);
router.put('/:id', authMiddleware, validatePost, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);
router.patch('/:id', postController.partiallyUpdatePost); // From Challenge 1
 


// --- Nested Comment Routes ---
// GET /posts/:postId/comments
router.get('/:postId/comments', commentController.getCommentsByPostId);
// POST /posts/:postId/comments
router.post('/:postId/comments', validateComment, commentController.createCommentForPost);




export default router;