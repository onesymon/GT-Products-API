// src/services/post.service.js
// src/services/post.service.js
import pool from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';


let posts = [
    { id: 1, title: 'First Post', content: 'This is the first post.' },
    { id: 2, title: 'Second Post', content: 'This is the second post.' }
];
let nextId = 3;


export const getAllPosts = async () => {
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
    `);
    return posts;
};

export const getPostById = async (id) => {
    const [rows] = await pool.query(`
        SELECT 
            p.id,
            p.title,
            p.content,
            p.authorId,
            u.username AS authorUsername,
            u.email AS authorEmail
        FROM posts p
        JOIN users u ON p.authorId = u.id
        WHERE p.id = ?
    `, [id]);
    if (!rows[0]) {
        throw new ApiError(404, "Post not found"); // Throws a specific error
    }
    return rows[0];
};

export const createPost = async (postData) => {
    const { title, content, authorId } = postData;
    
    try {
        const [result] = await pool.query(
            'INSERT INTO posts (title, content, authorId) VALUES (?, ?, ?)',
            [title, content, authorId]
        );
        const newPostId = result.insertId;
        return getPostById(newPostId);
    } catch (error) {
        // Handle foreign key constraint error (authorId doesn't exist)
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new ApiError(400, "Invalid author ID. User does not exist.");
        }
        // Re-throw other errors
        throw error;
    }
};
export const updatePost = async (id, postData, userId) => { // Add userId as an argument
    const { title, content } = postData;

    // First, get the post to check for ownership
    const post = await getPostById(id); // This will throw a 404 if not found

    // AUTHORIZATION CHECK
    if (post.authorId !== userId) {
        throw new ApiError(403, "Forbidden: You do not have permission to edit this post.");
    }

    // If the check passes, proceed with the update
    await pool.query(
        'UPDATE posts SET title = ?, content = ? WHERE id = ?',
        [title, content, id]
    );
    const updatedPost = await getPostById(id);
    return updatedPost;
};

export const deletePost = async (id, userId) => { // Add userId as an argument
    // First, get the post to check for ownership
    const post = await getPostById(id); // This will throw a 404 if not found

    // AUTHORIZATION CHECK
    if (post.authorId !== userId) {
        throw new ApiError(403, "Forbidden: You do not have permission to delete this post.");
    }
    
    // If the check passes, proceed with the deletion
    const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);
    return result.affectedRows;
};
