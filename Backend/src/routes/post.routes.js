const express = require('express');
const multer = require('multer');
const postController = require('../controllers/post.controller');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);
router.post('/', upload.single('image'), postController.createPost);
router.patch('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;
