const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contact_name: { type: String, required: true },
    contact_phone_number: { type: String, required: true },
});

module.exports = mongoose.model('Contact', ContactSchema);
