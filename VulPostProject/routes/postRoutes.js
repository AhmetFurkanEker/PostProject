const express = require('express');
const { createPost, getAllPosts, deletePost, searchPosts } = require('../controllers/postController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, createPost);

router.get('/', verifyToken, getAllPosts);

router.delete('/:id', verifyToken, deletePost);

router.get('/search', verifyToken, searchPosts);


module.exports = router;
