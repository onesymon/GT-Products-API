// src/controllers/user.controller.js
import * as userService from '../services/user.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from 'express-async-handler';

export const createUser = asyncHandler(async (req, res) => {
    const newUser = await userService.createUser(req.body);
    return res
        .status(201)
        .json(new ApiResponse(201, newUser, "User created successfully"));
});

export const getUserById = asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = await userService.getUserById(userId);
    
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User retrieved successfully"));
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    return res
        .status(200)
        .json(new ApiResponse(200, users, "Users retrieved successfully"));
});

export const getPostsByUser = asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const posts = await userService.getPostsByAuthorId(userId);
    return res
        .status(200)
        .json(new ApiResponse(200, posts, "User posts retrieved successfully"));
});
