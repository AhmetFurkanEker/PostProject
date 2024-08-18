const db = require('../models'); 

const createPost = async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required.' });
    }

    try {
        await db.Post.create({
            title,
            content,
            author_id: req.userId
        });
        res.status(201).json({ message: 'Post created!' });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post.' });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await db.Post.findAll({
            where: { author_id: req.userId },
            include: [{ model: db.User, attributes: ['username'] }]
        });
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts.' });
    }
};

const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await db.Post.findOne({
            where: { id, author_id: req.userId }
        });

        if (!post) {
            return res.status(403).json({ message: 'Not authorized to delete this post!' });
        }

        await post.destroy();
        res.json({ message: 'Post deleted!' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Error deleting post.' });
    }
};

const searchPosts = async (req, res) => {
    const { title } = req.query;

    if (!title) {
        return res.status(400).json({ message: 'Title query parameter is required.' });
    }

    try {
        const posts = await db.Post.findAll({
            where: {
                title: { [db.Sequelize.Op.like]: `%${title}%` },
                author_id: req.userId
            },
            include: [{ model: db.User, attributes: ['username'] }]
        });
        res.json(posts);
    } catch (error) {
        console.error('Error searching posts:', error);
        res.status(500).json({ message: 'Error searching posts.' });
    }
};

module.exports = { createPost, getAllPosts, deletePost, searchPosts };
