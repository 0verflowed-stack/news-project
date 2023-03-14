const { model, Schema } = require('mongoose');

const userShema = new Schema({
    title: String,
    likes: Number,
    dislikes: Number,
    comments: [{ body: String, date: String, user_id: { type: 'ObjectId', ref: 'User' } }],
    category: String,
    time: String
});

module.exports = model('News', userShema);