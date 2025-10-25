import pool from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcrypt'; // IMPORT BCRYPT

// This function will now be specifically for registration
export const registerUser = async (userData) => {
    const { username, email, password } = userData; // Destructure password
    try {
        // HASH THE PASSWORD
        const saltRounds = 10; // The cost factor for hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [result] = await pool.query(
            // Use the new password column
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            // Store the HASHED password, not the original
            [username, email, hashedPassword]
        );

        // Fetch the user, but OMIT the password from the return data
        const newUser = await getUserById(result.insertId);
        return newUser;

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new ApiError(409, "Username or email already exists.");
        }
        throw error;
    }
};

export const getUserById = async (id) => {
    // IMPORTANT: Exclude the password hash when fetching user data
    const [rows] = await pool.query('SELECT id, username, email, createdAt FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
        throw new ApiError(404, "User not found");
    }
    return rows[0];
};

export const getAllUsers = async () => {
    // IMPORTANT: Exclude the password hash here too
    const [users] = await pool.query('SELECT id, username, email, createdAt FROM users');
    return users;
};

export const getPostsByAuthorId = async (userId) => {
    const [posts] = await pool.query(`
        SELECT 
            p.id,
            p.title,
            p.content,
            p.authorId,
            u.username AS authorUsername,
            u.email AS authorEmail
        FROM posts p
        JOIN users u ON p.authorId = u.id
        WHERE p.authorId = ?
    `, [userId]);
    return posts;
};
