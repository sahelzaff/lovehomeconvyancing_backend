// blogRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import Blog from '../models/blog.js';

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // File name in destination folder
  }
});

// File upload limits and storage destination
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10 MB (adjust as necessary)
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb); // Function to check file type (e.g., image/jpeg, image/png)
  }
}).single('blogCoverPhoto'); // 'blogCoverPhoto' should match the name attribute in the form input

// Function to check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
}

// Create a new blog with file upload
router.post('/', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const blog = new Blog({
      blogId: req.body.blogId,
      blogTitle: req.body.blogTitle,
      blogDate: req.body.blogDate,
      blogContent: req.body.blogContent,
      blogCoverPhoto: req.file ? req.file.path : ''
    });

    try {
      const newBlog = await blog.save();
      res.status(201).json(newBlog);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
});

// Fetch all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Increment views count
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
