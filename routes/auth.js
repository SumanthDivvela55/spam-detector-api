const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, phone_number, email, password } = req.body;
    try {
        if (await User.findOne({ phone_number })) {
            return res.status(400).send({ error: 'Phone number already registered' });
        }
        const user = new User({ name, phone_number, email });
        await user.setPassword(password);
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/login', async (req, res) => {
    const { phone_number, password } = req.body;
    try {
        const user = await User.findOne({ phone_number });
        if (!user || !(await user.checkPassword(password))) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ token });
    } catch (error) {
        res.status(400).send({ error: 'Login failed' });
    }
});
module.exports = router;
