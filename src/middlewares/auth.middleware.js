import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "express-async-handler";
import { getUserById } from "../services/user.service.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  // Check for the token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
        // Get token from header (e.g., "Bearer <token>")
        token = req.headers.authorization.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get the user from the token's payload (id) and attach it to the request
        // We fetch from DB to ensure the user still exists
        req.user = await getUserById(decoded.id);

        next(); // Move to the next middleware or controller
    } catch (error) {
        throw new ApiError(401, "Not authorized, token failed");
    }
}

if (!token) {
    throw new ApiError(401, "Not authorized, no token");
}
});