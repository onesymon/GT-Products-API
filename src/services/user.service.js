// src/services/user.service.js
import pool from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export const createUser = async (userData) => {
    const { username, email } = userData;
    
    try {
        const [result] = await pool.query(
            'INSERT INTO users (username, email) VALUES (?, ?)',
            [username, email]
        );
        const newUserId = result.insertId;
        return getUserById(newUserId);
    } catch (error) {
        // Handle duplicate entry error (username or email already exists)
        if (error.code === 'ER_DUP_ENTRY') {
            throw new ApiError(409, "Username or email already exists.");
        }
        // Re-throw other errors
        throw error;
    }
};

export const getUserById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (!rows[0]) {
        throw new ApiError(404, "User not found");
    }
    return rows[0];
};

export const getAllUsers = async () => {
    const [users] = await pool.query('SELECT * FROM users');
    return users;
};
