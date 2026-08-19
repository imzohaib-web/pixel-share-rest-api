const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/post.routes');
const postController = require('./controllers/post.controller');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    return res.status(200).json({
        success: true,
        message: "PixelShare API is running"
    });
});

// RESTful Posts API
app.use('/api/posts', postRoutes);

// Legacy Endpoints Compatibility (Prevents breakage if any client hits old routes)
app.post('/create-post', upload.single('image'), postController.createPost);
app.get('/post', postController.getPosts);

// 404 Handler
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    return res.status(500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

module.exports = app;
