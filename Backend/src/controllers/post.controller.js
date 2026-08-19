const mongoose = require('mongoose');
const postModel = require('../../models/post.model');
const { uploadFile, deleteFile } = require('../../services/storage.service');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * GET /api/posts
 * Fetch all posts sorted by newest first
 */
const getPosts = asyncHandler(async (req, res) => {
    const posts = await postModel.find().sort({ createdAt: -1 });
    return res.status(200).json({
        success: true,
        message: "Posts fetched successfully",
        data: posts
    });
});

/**
 * GET /api/posts/:id
 * Fetch a single post by ID
 */
const getPostById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(404, "Post not found");
    }

    const post = await postModel.findById(id);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    return res.status(200).json({
        success: true,
        message: "Post fetched successfully",
        data: post
    });
});

/**
 * POST /api/posts
 * Create a new post with image upload
 */
const createPost = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "Image is required");
    }

    let caption = '';
    if (req.body.caption !== undefined && req.body.caption !== null) {
        if (typeof req.body.caption !== 'string') {
            throw new ApiError(400, "Caption must be a string");
        }
        caption = req.body.caption.trim();
        if (caption.length > 500) {
            throw new ApiError(400, "Caption must not exceed 500 characters");
        }
    }

    const result = await uploadFile(req.file.buffer, req.file.originalname);
    
    const post = await postModel.create({
        image: result.url,
        fileId: result.fileId,
        caption
    });

    return res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: post
    });
});

/**
 * PATCH /api/posts/:id
 * Update post caption
 */
const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(404, "Post not found");
    }

    if (!req.body || req.body.caption === undefined || req.body.caption === null) {
        throw new ApiError(400, "Caption is required for update");
    }

    if (typeof req.body.caption !== 'string') {
        throw new ApiError(400, "Caption must be a string");
    }

    const trimmedCaption = req.body.caption.trim();

    if (trimmedCaption.length > 500) {
        throw new ApiError(400, "Caption must not exceed 500 characters");
    }

    const post = await postModel.findById(id);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    post.caption = trimmedCaption;
    await post.save();

    return res.status(200).json({
        success: true,
        message: "Post updated successfully",
        data: post
    });
});

/**
 * DELETE /api/posts/:id
 * Delete post and its ImageKit file
 */
const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(404, "Post not found");
    }

    const post = await postModel.findById(id);

    if (!post) {
        throw new ApiError(404, "Post not found");
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
});

module.exports = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};
