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
 * Create a new post with image upload to ImageKit & MongoDB persistence
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

    // 1. Upload file to ImageKit cloud storage
    const uploadResult = await uploadFile(req.file.buffer, req.file.originalname);

    // 2. Persist post record in MongoDB only after ImageKit upload succeeds
    const post = await postModel.create({
        image: uploadResult.url,
        fileId: uploadResult.fileId,
        caption
    });

    return res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: post
    });
});

/**
 * PATCH / PUT /api/posts/:id
 * Update post caption and/or replace uploaded image on ImageKit
 */
const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(404, "Post not found");
    }

    const post = await postModel.findById(id);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // 1. Validate & update caption if provided
    if (req.body.caption !== undefined && req.body.caption !== null) {
        if (typeof req.body.caption !== 'string') {
            throw new ApiError(400, "Caption must be a string");
        }
        const trimmedCaption = req.body.caption.trim();
        if (trimmedCaption.length > 500) {
            throw new ApiError(400, "Caption must not exceed 500 characters");
        }
        post.caption = trimmedCaption;
    }

    // 2. Handle image replacement if a new image file is uploaded
    if (req.file) {
        // Upload new image to ImageKit first
        const uploadResult = await uploadFile(req.file.buffer, req.file.originalname);
        const oldFileId = post.fileId;

        // Update post with new ImageKit URL and fileId
        post.image = uploadResult.url;
        post.fileId = uploadResult.fileId;

        // Safely remove previous cloud image after new image upload succeeds
        if (oldFileId) {
            await deleteFile(oldFileId);
        }
    } else if (req.body.caption === undefined && !req.file) {
        throw new ApiError(400, "At least one field (caption or image) must be provided for update");
    }

    await post.save();

    return res.status(200).json({
        success: true,
        message: "Post updated successfully",
        data: post
    });
});

/**
 * DELETE /api/posts/:id
 * Delete post from MongoDB and delete its associated file from ImageKit
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

    // 1. Delete associated asset from ImageKit if fileId exists
    if (post.fileId) {
        await deleteFile(post.fileId);
    }

    // 2. Remove document from MongoDB database
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
