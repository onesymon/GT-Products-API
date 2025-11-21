// src/services/comment.services.js
import pool from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export const getAllComments = async () => {
    const [comments] = await pool.query('SELECT * FROM comments');
    return comments;
};


export const createComment = async (postId, authorId, commentData) => {
    const { text } = commentData;
    
    try {
        const [result] = await pool.query(
            'INSERT INTO comments (text, postId, authorId) VALUES (?, ?, ?)',
            [text, postId, authorId]
        );
        const newCommentId = result.insertId;
        
        // Select the comment we just created
        const [rows] = await pool.query('SELECT * FROM comments WHERE id = ?', [newCommentId]);
        return rows[0];
    } catch (error) {
        // Handle foreign key constraint error (authorId or postId doesn't exist)
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new ApiError(400, "Invalid postId or authorId. The specified post or user does not exist.");
        }
        // Re-throw other errors
        throw error;
    }
};

export const getCommentById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM comments WHERE id = ?', [id]);
    if (!rows[0]) {
        throw new ApiError(404, "Comment not found");
    }
    return rows[0];
};

export const updateComment = async (id, commentData) => {
    const { text } = commentData;
    const [result] = await pool.query(
        'UPDATE comments SET text = ? WHERE id = ?',
        [text, id]
    );
    if (result.affectedRows === 0) {
        return null;
    }
    return getCommentById(id);
};

// Check if a user owns a specific comment
export const isCommentOwner = async (commentId, userId) => {
    const [rows] = await pool.query(
        'SELECT authorId FROM comments WHERE id = ?',
        [commentId]
    );
    if (!rows[0]) {
        return false; // Comment doesn't exist
    }
    return rows[0].authorId === userId;
};

export const deleteComment = async (id) => {
    const [result] = await pool.query('DELETE FROM comments WHERE id = ?', [id]);
    return result.affectedRows > 0;
};
