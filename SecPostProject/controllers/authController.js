const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();


const SECRET_KEY = process.env.SECRET_KEY ;

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await req.promisePool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0 || !(await bcrypt.compare(password, rows[0].password))) {
            return res.status(401).json({ message: 'Wrong username/password combination!' });
        }

        const token = jwt.sign({ id: rows[0].id }, SECRET_KEY, { expiresIn: '1h' });

        res.json({
            token,
            username: rows[0].username
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [existingUser] = await req.promisePool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username already exists!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await req.promisePool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = { login, register };
