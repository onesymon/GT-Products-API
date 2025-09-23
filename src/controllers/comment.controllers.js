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

export const createCommentForPost = asyncHandler(async (req, res) => {
    const postId = parseInt(req.params.postId, 10);
    const { text, authorId } = req.body;
    const newComment = await commentService.createComment(postId, authorId, { text });
    return res
        .status(201)
        .json(new ApiResponse(201, newComment, "Comment created successfully"));
});