const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/post.routes');
const postController = require('./controllers/post.controller');
const handleImageUpload = require('./middlewares/upload.middleware');
const notFoundMiddleware = require('./middlewares/notFound.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

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
app.post('/create-post', handleImageUpload, postController.createPost);
app.get('/post', postController.getPosts);

// 404 Route Not Found Handler
app.use(notFoundMiddleware);

// Centralized Express Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
