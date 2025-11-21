// src/controllers/comment.controllers.js
import * as commentService from '../services/comment.services.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from 'express-async-handler';

export const getAllComments = asyncHandler(async (req, res) => {
    const comments = await commentService.getAllComments();
    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments retrieved successfully"));
});

export const getCommentsByPostId = asyncHandler(async (req, res) => {
    const postId = parseInt(req.params.postId, 10);
    const comments = await commentService.getCommentsByPostId(postId);
    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments retrieved successfully"));
});

// Create comment for a specific post (from post routes)
export const createCommentForPost = asyncHandler(async (req, res) => {
    const postId = parseInt(req.params.postId, 10);
    const { content } = req.body;
    const authorId = req.user.id; // Get from authenticated user
    const newComment = await commentService.createComment(postId, authorId, { text: content });
    return res
        .status(201)
        .json(new ApiResponse(201, newComment, "Comment created successfully"));
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