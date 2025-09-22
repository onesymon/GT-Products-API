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
    const [posts] = await pool.query('SELECT * FROM posts');
    return posts;
};

export const getPostById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
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
    export const updatePost = async (id, postData) => {
        const { title, content } = postData;
        const [result] = await pool.query(
            'UPDATE posts SET title = ?, content = ? WHERE id = ?',
            [title, content, id]
        );
        if (result.affectedRows === 0) {
            return null;
        }
        return getPostById(id);
    };

    export const partiallyUpdatePost = async (id, updates) => {
        const fields = Object.keys(updates);
        const values = Object.values(updates);

        if (fields.length === 0) {
            return getPostById(id);
        }
        
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        
        const [result] = await pool.query(
            `UPDATE posts SET ${setClause} WHERE id = ?`,
            [...values, id]
        );

        if (result.affectedRows === 0) {
            return null;
        }
        return getPostById(id);
    };

 export const deletePost = async (id) => {
        const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);
        return result.affectedRows > 0;
    };


