const { model, Schema } = require('mongoose');

const userShema = new Schema({
    username: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String }
});

module.exports = model('User', userShema);