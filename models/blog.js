// ../models/blog.js
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  blogId: String,
  blogTitle: String,
  blogDate: Date,
  blogContent: String,
  blogCoverPhoto: String,
  views: { type: Number, default: 0 }, // Add views field
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
