import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Blog from '../models/blog.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10 MB limit
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('blogCoverPhoto');

// Function to check file type
function checkFileType(file, cb) {
  console.log('Checking file type:', file.mimetype);
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
}

// Function to upload to Cloudinary
const uploadToCloudinary = (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    console.log('Starting Cloudinary upload for:', originalname);
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'LHC_Blog_Cover_Images',
        resource_type: 'auto',
        public_id: `blog_${Date.now()}`, // Ensure unique filename
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('Cloudinary upload success:', result.secure_url);
          resolve(result);
        }
      }
    );

    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);
    
    bufferStream.on('error', error => {
      console.error('Buffer stream error:', error);
      reject(error);
    });

    uploadStream.on('error', error => {
      console.error('Upload stream error:', error);
      reject(error);
    });

    bufferStream.pipe(uploadStream);
  });
};

// Create a new blog with file upload
router.post('/', (req, res) => {
  console.log('Received blog creation request');
  
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer upload error:', err);
      return res.status(400).json({ message: err.message });
    }

    try {
      console.log('File received:', req.file ? req.file.originalname : 'No file uploaded');
      
      let cloudinaryResult;
      if (req.file) {
        try {
          cloudinaryResult = await uploadToCloudinary(req.file.buffer, req.file.originalname);
          console.log('Image uploaded to Cloudinary:', cloudinaryResult.secure_url);
        } catch (uploadError) {
          console.error('Error uploading to Cloudinary:', uploadError);
          return res.status(500).json({ message: 'Failed to upload image to Cloudinary' });
        }
      }

      const blogData = {
        blogId: req.body.blogId,
        blogTitle: req.body.blogTitle,
        blogDate: req.body.blogDate,
        blogContent: req.body.blogContent,
        blogCoverPhoto: cloudinaryResult ? cloudinaryResult.secure_url : ''
      };

      console.log('Creating blog with data:', {
        ...blogData,
        blogContent: blogData.blogContent ? 'Content present' : 'No content'
      });

      const blog = new Blog(blogData);
      const newBlog = await blog.save();
      
      console.log('Blog created successfully:', newBlog._id);
      res.status(201).json(newBlog);
    } catch (error) {
      console.error('Error creating blog:', error);
      res.status(400).json({ message: error.message });
    }
  });
});

// Fetch all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find();
    console.log(`Retrieved ${blogs.length} blogs`);
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: error.message });
  }
});

// Fetch a specific blog by ID and increment views
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      console.log('Blog not found:', req.params.id);
      return res.status(404).json({ message: 'Blog post not found' });
    }

    blog.views += 1;
    await blog.save();
    
    console.log('Blog views incremented:', req.params.id);
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a blog post by ID
router.delete('/:id', async (req, res) => {
  try {
    console.log('Attempting to delete blog:', req.params.id);
    
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      console.log('Blog not found for deletion:', req.params.id);
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Delete image from Cloudinary if it exists
    if (blog.blogCoverPhoto) {
      try {
        const publicId = `LHC_Blog_Cover_Images/${blog.blogCoverPhoto.split('/').pop().split('.')[0]}`;
        console.log('Deleting image from Cloudinary:', publicId);
        await cloudinary.uploader.destroy(publicId);
        console.log('Successfully deleted image from Cloudinary');
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with blog deletion even if image deletion fails
      }
    }

    // Delete the blog from database
    await Blog.findByIdAndDelete(req.params.id);
    console.log('Blog successfully deleted:', req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid blog ID format' });
    }
    res.status(500).json({ message: 'Error deleting blog post' });
  }
});

export default router;



//fixed the blogs routes problem,