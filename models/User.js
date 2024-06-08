const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone_number: { type: String, unique: true, required: true },
    email: { type: String, unique: true, sparse: true },
    password_hash: { type: String, required: true },
});

UserSchema.methods.setPassword = async function (password) {
    this.password_hash = await bcrypt.hash(password, 10);
};

UserSchema.methods.checkPassword = async function (password) {
    return bcrypt.compare(password, this.password_hash);
};

module.exports = mongoose.model('User', UserSchema);
