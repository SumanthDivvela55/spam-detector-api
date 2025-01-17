const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpamSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Spam', SpamSchema);
