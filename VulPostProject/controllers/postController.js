const createPost = async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required.' });
    }

    try {
        await req.promisePool.query(
            'INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)',
            [title, content, req.userId]
        );
        res.status(201).json({ message: 'Post created!' });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post.' });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const [rows] = await req.promisePool.query(
            'SELECT posts.*, users.username AS author FROM posts JOIN users ON posts.author_id = users.id WHERE posts.author_id = ?',
            [req.userId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts.' });
    }
};

const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await req.promisePool.query('SELECT * FROM posts WHERE id = ?', [id]);

        if (rows.length === 0 || rows[0].author_id !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this post!' });
        }

        await req.promisePool.query('DELETE FROM posts WHERE id = ?', [id]);
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
        const query = `SELECT posts.*, users.username AS author 
                        FROM posts 
                        JOIN users ON posts.author_id = users.id 
                        WHERE posts.title LIKE '%${title}%' AND posts.author_id = ${req.userId}`;
        const [rows] = await req.promisePool.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error searching posts:', error);
        res.status(500).json({ message: 'Error searching posts.' });
    }
};


module.exports = { createPost, getAllPosts, deletePost, searchPosts };