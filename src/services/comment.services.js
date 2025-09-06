// src/services/comment.service.js

// In-memory "database" for comments
let comments = [
    { id: 1, text: 'Great first post!', postId: 1 },
    { id: 2, text: 'I agree, very insightful.', postId: 1 },
    { id: 3, text: 'This is a comment on the second post.', postId: 2 },
];
let nextId = 4;

// We need access to posts to ensure a post exists before adding a comment
import { getPostById } from './post.service.js';

export const getAllComments = () => {
    return comments;
};

export const getCommentsByPostId = (postId) => {
    return comments.filter(c => c.postId === postId);
};

export const createComment = (postId, commentData) => {
    // Check if the post actually exists before creating a comment for it
    const post = getPostById(postId);
    if (!post) {
        return null; // Or throw an error
    }
    const newComment = { id: nextId++, postId, ...commentData };
    comments.push(newComment);
    return newComment;
};
// Additional functions for updating/deleting comments can be added as needed   

// Example: Update a comment
export const updateComment = (id, commentData) => {
    const commentIndex = comments.findIndex(c => c.id === id);      
    if (commentIndex === -1) {
        return null; // Not found
    }
    comments[commentIndex] = { ...comments[commentIndex], ...commentData };
    return comments[commentIndex];
}



// Example: Delete a comment
export const deleteComment = (id) => {
    const commentIndex = comments.findIndex(c => c.id === id);
    if (commentIndex === -1) {
        return false; // Not found
    }
    comments.splice(commentIndex, 1);
    return true;
}   
