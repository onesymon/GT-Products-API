// src/controllers/comment.controllers.js
import * as commentService from '../services/comment.services.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from 'express-async-handler';

export const getAllComments = asyncHandler(async (req, res) => {
    const comments = await commentService.getAllComments();
    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments retrieved successfully"));
});


// Create comment with postId in body (from comment routes)
export const createComment = asyncHandler(async (req, res) => {
    const { content, postId } = req.body;
    const authorId = req.user.id; // Get from authenticated user
    const newComment = await commentService.createComment(postId, authorId, { text: content });
    return res
        .status(201)
        .json(new ApiResponse(201, newComment, "Comment created successfully"));
});

// Get a specific comment by ID
export const getCommentById = asyncHandler(async (req, res) => {
    const commentId = parseInt(req.params.id, 10);
    const comment = await commentService.getCommentById(commentId);
    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment retrieved successfully"));
});

// Update a comment (PUT - full update)
export const updateComment = asyncHandler(async (req, res) => {
    const commentId = parseInt(req.params.id, 10);
    const { content } = req.body;
    const userId = req.user.id;
    
    // Check if user owns the comment
    const isOwner = await commentService.isCommentOwner(commentId, userId);
    if (!isOwner) {
        throw new ApiError(403, "You can only update your own comments");
    }
    
    const updatedComment = await commentService.updateComment(commentId, { text: content });
    if (!updatedComment) {
        throw new ApiError(404, "Comment not found");
    }
    
    return res
        .status(200)
        .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

// Patch a comment (PATCH - partial update)
export const patchComment = asyncHandler(async (req, res) => {
    const commentId = parseInt(req.params.id, 10);
    const { content } = req.body;
    const userId = req.user.id;
    
    // Check if user owns the comment
    const isOwner = await commentService.isCommentOwner(commentId, userId);
    if (!isOwner) {
        throw new ApiError(403, "You can only update your own comments");
    }
    
    const updatedComment = await commentService.updateComment(commentId, { text: content });
    if (!updatedComment) {
        throw new ApiError(404, "Comment not found");
    }
    
    return res
        .status(200)
        .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

// Delete a comment
export const deleteComment = asyncHandler(async (req, res) => {
    const commentId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    
    // Check if user owns the comment
    const isOwner = await commentService.isCommentOwner(commentId, userId);
    if (!isOwner) {
        throw new ApiError(403, "You can only delete your own comments");
    }
    
    const deleted = await commentService.deleteComment(commentId);
    if (!deleted) {
        throw new ApiError(404, "Comment not found");
    }
    
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Comment deleted successfully"));
});