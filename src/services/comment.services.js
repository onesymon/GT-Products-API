// src/services/comment.services.js
import pool from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export const getAllComments = async () => {
    const [comments] = await pool.query('SELECT * FROM comments');
    return comments;
};

export const getCommentsByPostId = async (postId) => {
    const [comments] = await pool.query('SELECT * FROM comments WHERE postId = ?', [postId]);
    return comments;
};

export const createComment = async (postId, commentData) => {
    const { content, authorId } = commentData;
    
    try {
        const [result] = await pool.query(
            'INSERT INTO comments (content, postId, authorId) VALUES (?, ?, ?)',
            [content, postId, authorId]
        );
        const newCommentId = result.insertId;
        return getCommentById(newCommentId);
    } catch (error) {
        // Handle foreign key constraint error (authorId or postId doesn't exist)
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new ApiError(400, "Invalid author ID or post ID. User or post does not exist.");
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
    const { content } = commentData;
    const [result] = await pool.query(
        'UPDATE comments SET content = ? WHERE id = ?',
        [content, id]
    );
    if (result.affectedRows === 0) {
        return null;
    }
    return getCommentById(id);
};

export const deleteComment = async (id) => {
    const [result] = await pool.query('DELETE FROM comments WHERE id = ?', [id]);
    return result.affectedRows > 0;
};
