const mongoose = require('mongoose');
const postModel = require('../../models/post.model');
const { uploadFile, deleteFile } = require('../../services/storage.service');

/**
 * GET /api/posts
 * Fetch all posts
 */
async function getPosts(req, res, next) {
    try {
        const posts = await postModel.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            data: posts
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/posts/:id
 * Fetch a single post by ID
 */
async function getPostById(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const post = await postModel.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Post fetched successfully",
            data: post
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/posts
 * Create a new post with image upload
 */
async function createPost(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const result = await uploadFile(req.file.buffer, req.file.originalname);
        
        const post = await postModel.create({
            image: result.url,
            fileId: result.fileId,
            caption: req.body.caption || ''
        });

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: post
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PATCH /api/posts/:id
 * Update post caption
 */
async function updatePost(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const post = await postModel.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        if (req.body.caption !== undefined) {
            post.caption = req.body.caption;
        }

        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: post
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/posts/:id
 * Delete post and its ImageKit file
 */
async function deletePost(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const post = await postModel.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        if (post.fileId) {
            await deleteFile(post.fileId);
        }

        await postModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            data: { id }
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};
