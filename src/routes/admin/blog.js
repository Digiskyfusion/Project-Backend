import express from 'express';
import BlogPostController from '../../controllers/admin/blog.js';

const router = express.Router();

// Create a new blog post
router.post('/create', BlogPostController.createBlogPost);

// Update a blog posts
router.put('/update/:id', BlogPostController.updateBlogPost);

// Delete a blog post
router.delete('/delete/:id', BlogPostController.deleteBlogPost);

// Get a single blog post by ID
router.get('/get/:id', BlogPostController.getBlogPost);

// Get all blog posts with pagination
router.get('/all', BlogPostController.getAllBlogPosts);

export default router;
