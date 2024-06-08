const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Contact = require('../models/Contact');
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

// GET search endpoint
router.get('/', authMiddleware, async (req, res) => {
    const phoneNumber = req.query.phone_number;
    if (!phoneNumber) {
        return res.status(400).send({ error: 'Phone number is required.' });
    }

    try {
        // Search in User collection
        const users = await User.find({ phone_number: phoneNumber }).select('-password_hash');

        // Search in Contact collection
        const contacts = await Contact.find({ phone_number: phoneNumber });

        // Combine results
        const results = [...users, ...contacts];

        // Check spam reports
        const spamCount = await Spam.countDocuments({ phone_number: phoneNumber });
        const isSpam = spamCount > 10; // Adjust this threshold as needed

        res.status(200).send({ results, spamCount, isSpam });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'Server error.' });
    }
});

module.exports = router;
