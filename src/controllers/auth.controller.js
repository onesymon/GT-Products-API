// src/controllers/auth.controller.js
import * as userService from '../services/user.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from 'express-async-handler';

export const registerUser = asyncHandler(async (req, res) => {
    // The service now handles password hashing
    const newUser = await userService.registerUser(req.body);
    res.status(201).json(new ApiResponse(201, newUser, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }
    
    const result = await userService.loginUser(email, password);
    res.status(200).json(new ApiResponse(200, result, "Login successful"));
});