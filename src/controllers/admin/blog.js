import mongoose from 'mongoose';
import BlogPost from '../../models/blog.js';

class BlogPostController {
    // Create a new Blog Post
    static createBlogPost = async (req, res) => {
        try {
            const { blog_heading, blog_content, tags, blog_image = '' } = req.body;
            
            // Ensure tags are stored as an array
            const tagArray = typeof tags === "string" ? tags.split(",").map(tag => tag.trim()) : [];
    
            const newBlog = new BlogPost({
                blog_heading,
                blog_content,
                blog_image, // Image is directly taken as a string from req.body
                tags: tagArray,
            });
             console.log("newBlog");
             console.log(newBlog);
            await newBlog.save();
            res.status(201).json({ message: "Blog post created successfully", newBlog });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    // Update an existing Blog Post
    static updateBlogPost = async (req, res) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid Blog Post ID' });
            }

            const updateData = { ...req.body };
            if (req.file) {
                updateData.blog_image = req.file.path;
            }

            const updatedBlogPost = await BlogPost.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });

            if (!updatedBlogPost) {
                return res.status(404).json({ error: 'Blog Post not found' });
            }

            res.status(200).json(updatedBlogPost);
        } catch (error) {
            res.status(500).json({ error: 'Error updating Blog Post' });
        }
    };

    // Delete a Blog Post
    static deleteBlogPost = async (req, res) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid Blog Post ID' });
            }

            const deletedBlogPost = await BlogPost.findByIdAndDelete(id);

            if (!deletedBlogPost) {
                return res.status(404).json({ error: 'Blog Post not found' });
            }

            res.status(200).json({ message: 'Blog Post deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting Blog Post' });
        }
    };

    // Get a single Blog Post by ID
    static getBlogPost = async (req, res) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid Blog Post ID' });
            }

            const blogPost = await BlogPost.findById(id);

            if (!blogPost) {
                return res.status(404).json({ error: 'Blog Post not found' });
            }

            res.status(200).json(blogPost);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching Blog Post' });
        }
    };

    // Get all Blog Posts with pagination
    static getAllBlogPosts = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const [blogPosts, total] = await Promise.all([
                BlogPost.find().populate('author').skip(skip).limit(limit).exec(),
                BlogPost.countDocuments(),
            ]);

            res.status(200).json({
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                blogPosts,
            });
        } catch (error) {
            res.status(500).json({ error: 'Error fetching Blog Posts' });
        }
    };
}

export default BlogPostController;
