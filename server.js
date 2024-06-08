const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const contactsRouter = require('./routes/contacts');
const spamRouter = require('./routes/spam'); 
const searchRouter = require('./routes/search');

app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/contacts', contactsRouter);
app.use('/spam', spamRouter); 
app.use('/search', searchRouter);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
