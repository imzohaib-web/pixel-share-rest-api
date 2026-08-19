const express = require('express');
const postController = require('../controllers/post.controller');
const handleImageUpload = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);
router.post('/', handleImageUpload, postController.createPost);
router.patch('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;
