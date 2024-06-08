const express = require('express');
const router = express.Router();
const Spam = require('../models/Spam');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send({ error: 'Invalid token.' });
    }
};

// POST spam endpoint
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { phone_number } = req.body;
        const spam = new Spam({
            user_id: req.user.id,
            phone_number: phone_number
        });
        await spam.save();
        res.status(201).send(spam);
    } catch (error) {
        res.status(500).send({ error: 'Server error.' });
    }
});

module.exports = router;
