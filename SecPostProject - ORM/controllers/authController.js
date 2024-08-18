const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const db = require('../models'); 

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        
        const user = await db.User.findOne({ where: { username } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Wrong username/password combination!' });
        }

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

        res.json({
            token,
            username: user.username
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await db.User.findOne({ where: { username } });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.User.create({ username, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

const logout = (req, res) => {
    res.json({ message: 'Logout successful' });
};

module.exports = {
    login,
    register,
    logout
};
