// src/routes/post.routes.js
import { Router } from 'express';
import * as postController from '../controllers/post.controller.js';
// *** IMPORT THE COMMENT CONTROLLER ***
import * as commentController from '../controllers/comment.controller.js';

const router = Router();

// --- Post Routes ---
router.get('/', postController.getAllPosts);
router.post('/', postController.createPost);
router.get('/:id', postController.getPostById);
router.put('/:id', postController.updatePost);
router.patch('/:id', postController.partiallyUpdatePost); // From Challenge 1
router.delete('/:id', postController.deletePost);

// --- Nested Comment Routes ---
// GET /posts/:postId/comments
router.get('/:postId/comments', commentController.getCommentsByPostId);
// POST /posts/:postId/comments
router.post('/:postId/comments', commentController.createCommentForPost);

export default router;