const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
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

// GET contacts endpoint
router.get('/', authMiddleware, async (req, res) => {
    try {
        const contacts = await Contact.find({ user_id: req.user.id });
        res.send(contacts);
    } catch (error) {
        res.status(500).send({ error: 'Server error.' });
    }
});

// POST contact endpoint
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, phone_number } = req.body;
        const contact = new Contact({
            user_id: req.user.id,
            contact_name: name,
            contact_phone_number: phone_number
        });
        await contact.save();
        res.status(201).send(contact);
    } catch (error) {
        res.status(500).send({ error: 'Server error.' });
    }
});

module.exports = router;
