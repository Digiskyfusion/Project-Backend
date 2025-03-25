import mongoose from "mongoose";

const BlogPostSchema = new mongoose.Schema({
  blog_heading: {
    type: String,
    required: true,
    trim: true,
  },
  blog_content: {
    type: String,
    required: true,
  },
  blog_image: {
    type: String, // Store image URL or file path
    required: true,
  },
  tags: {
    type: [String], // Array of tags
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const BlogPost = mongoose.model("BlogPost", BlogPostSchema);

export default BlogPost;
