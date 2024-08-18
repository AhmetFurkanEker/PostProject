const express = require('express');
const { login, register } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.post('/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
});

module.exports = router;
